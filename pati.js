
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ================= CUSTOM LOGGER =================

const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const period = Date.now() - start;

        const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${period}ms\n`;

        fs.appendFile("./server.log", log, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    next();
};

app.use(logger);

// ================= VALIDATION MIDDLEWARE =================

const validate = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        return next(err);
    }

    next();
};

app.use("/api", validate);

// ================= CREATE - POST =================

app.post("/api/v1/patients", (req, res) => {
    res.status(200).send("Patient Created Successfully");
});

// ================= READ - GET ALL =================

app.get("/api/v1/patients", (req, res) => {
    const { gender } = req.query;

    if (gender) {
        return res
            .status(200)
            .send(`Patients in gender ${gender} fetched successfully`);
    } else {
        return res
            .status(200)
            .send("All patients fetched successfully");
    }
});

// ================= READ - GET BY ID =================

app.get("/api/v1/patients/:id", (req, res) => {
    const id = req.params.id;

    res
        .status(200)
        .send(`Patient with ${id} fetched successfully`);
});

// ================= DELETE =================

app.delete("/api/v1/patients/:id", (req, res) => {
    const id = req.params.id;

    res
        .status(200)
        .send(`Patient with ${id} deleted successfully`);
});

// ================= UPDATE - PATCH =================

app.patch("/api/v1/patients/:id", (req, res) => {
    const id = req.params.id;

    res
        .status(200)
        .send(`Patient with ${id} updated successfully`);
});

// ================= 404 =================

app.use((req, res) => {
    res.status(404).send("Resource not found");
});

// ================= ERROR HANDLING =================

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).send(message);
});

// ================= START SERVER =================

const PORT = 6000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

