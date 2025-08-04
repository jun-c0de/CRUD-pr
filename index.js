const express = require("express")
const app = express()
const PORT = 3000

app.use(express.json())

// 초기 데이터 3개 
let posts = [
    {
        id: 1,
        displayId: 1,
        subject: "subject-1",
        desc: "desc-1",
        createdAt: "2025-08-01",
        status: "draft",
        likes: 0
    },
    {
        id: 2,
        displayId: 2,
        subject: "subject-2",
        desc: "desc-2",
        createdAt: "2025-08-01",
        status: "published",
        likes: 3
    },
    {
        id: 3,
        displayId: 3,
        subject: "subject-3",
        desc: "desc-3",
        createdAt: "2025-08-01",
        status: "archived",
        likes: 1
    }
];

let initId = 4

app.post("/posts", (req, res) => {
    try {
        const {subject, desc, status} = req.body

        const newPosts = {
            id: initId++,
            displayId: posts.length + 1,
            subject: subject.trim(),
            desc: desc.trim(),
            createdAt: new Date().toISOString().split("T")[0], // "2025-08-01"
            status: status || "draft",
            likes: 0
        };

        posts.push(newPosts);

        res.status(201).json({ message: "게시글 생성 완료", posts: newPosts });
    } catch (error) {
        console.error("게시물 생성 중 오류", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

app.get("/posts", (req, res) => {
    try {
        res.status(200).json({ message: "게시물 불러오기 성공", posts })
    } catch (error) {
        console.error("게시물 불러오기 중 오류", error)
        res.status(500).json({ message: "서버 내부 오류 발생" })
    }
})

//아이디 하나씩 불러오기
app.get("/posts/:id", (req, res) => {
    try {
        const userId = Number(req.params.id)
        const index = posts.findIndex(u => u.id === userId)
        if (index === 1) {
            return res.status(404).json({ message: "조회할 게시물이 없습니다" })
        }
        res.status(200).json({ message: "게시물 1개 조회 완료", posts: posts[index] })
    } catch (error) {
        console.error("게시물 1개 조회중 오류", error)
        res.status(500).json({ message: "서버 내부 오류 발생" })
    }
})

app.put("/posts/:id", (req, res) => {
    try {
        const userId = Number(req.params.id)
        const index = posts.findIndex(u => u.id === userId)
        if (index === -1) {
            return res.status(404).json({ message: "조회할 게시물이 없습니다" })
        }
        const updateData = req.body
        posts[index] = {
            ...posts[index],
            ...updateData
        }
        res.status(200).json({ message: "게시물 1개 수정 완료", posts: posts[index] })
    } catch (error) {
        console.error("게시물 1개 수정중 오류", error)
        res.status(500).json({ message: "서버 내부 오류 발생" })
    }
})

app.delete("/posts/:id", (req, res) => {
    try {
        const userId = Number(req.params.id)
        const index = posts.findIndex(u => u.id === userId)
        if (index === -1) {
            return res.status(404).json({ message: "조회할 게시물이 없습니다" })
        }
        posts.splice(index, 1)
        res.status(200).json({ message: "게시물 삭제 성공", posts })
    } catch (error) {
        console.error("게시물 삭제중 오류", error)
        res.status(500).json({ message: "서버 내부 오류 발생" })
    }
})

app.patch("/posts/:id/subject", (req, res) => {

    try {
        const userId = Number(req.params.id)
        const index = posts.findIndex(u => u.id === userId)

        if (index === -1) {
            res.status(404).json({ message: "게시글 일부 수정 중 아이디가 없음" })
        }
        const { subject } = req.body



        if (typeof subject !== 'string' || subject.trim() === "") {
            return res.status(400).json({
                message: "과목은 비어있지 않은 문자열 이어야 합니다."
            })
        }

        posts[index] = {
            ...posts[index],
            subject: subject.trim()
        }

        res.status(200).json({ message: "게시글 과목 수정하기 완료", posts: posts[index] })


    } catch (error) {
        console.error("게시글 과목 수정 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})

app.patch("/posts/:id/desc", (req, res) => {

    try {
        const userId = Number(req.params.id)
        const index = posts.findIndex(u => u.id === userId)

        if (index === -1) {
            res.status(404).json({ message: "게시글 일부 수정 중 아이디가 없음" })
        }
        const { desc } = req.body



        if (typeof desc !== 'string' || desc.trim() === "") {
            return res.status(400).json({
                message: "desc은 비어있지 않은 문자열 이어야 합니다."
            })
        }

        posts[index] = {
            ...posts[index],
            desc: desc.trim()
        }

        res.status(200).json({ message: "게시글 desc 수정하기 완료", posts: posts[index] })


    } catch (error) {
        console.error("게시글 과목 수정 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})

app.patch("/posts/:id/status", (req, res) => {
    try {
        const userId = Number(req.params.id);
        const index = posts.findIndex(u => u.id === userId);

        if (index === -1) {
            return res.status(404).json({ message: "게시글 일부 수정 중 아이디가 없음" });
        }

        const { status } = req.body;

        const ALLOWED = ["draft", "published", "archived"];

        if (!ALLOWED.includes(status)) {
            return res.status(400).json({
                message: `status는 ${ALLOWED.join(", ")} 중 하나여야 합니다.`
            });
        }

        posts[index] = {
            ...posts[index],
            status
        };

        res.status(200).json({ message: "게시글 상태 수정 완료", posts: posts[index] });

    } catch (error) {
        console.error("게시글 상태 수정 중 오류", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.listen(PORT, () => {
    console.log("Server is running")
})