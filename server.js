
const http = require("http")
const express = require("express")

const fs = require("fs")

const app = express()
const server = http.createServer(app)

const router = express.Router()

let cache = {}

app.use("/bibles", router)
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html")
})

router.get("/:version", (request, response) => {
    if (["NIV"].includes(request.params.version)) {
        bible = cache.bibles[request.params.version]
        if (request.query.book && request.query.chapter) {
            bible.testaments.forEach((book) => {
                if (book.name.toLowerCase().split(" ").join("") === request.query.book) {
                    book.chapters.forEach((chapter) => {
                        if (chapter.name.split(" ")[chapter.name.split(" ").length-1] === request.query.chapter) {
                            response.json(chapter)
                        }
                    })
                }
            })
        } else {
            books = []
            bible.testaments.forEach((book) => {
                books.push([book.name, book.chapters.length])
            })
            response.json({
                name: [bible.name, request.params.version],
                books: books
            })
        }
    }
})

server.listen(5000, () => {
    cache["bibles"] = {
        "NIV": JSON.parse(fs.readFileSync("NIV.json").toString())[0]
    }
})