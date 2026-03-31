const express = require("express");
const app = express();
const produtosRoutes = require("./routes/produtos");

app.use(express.json());

app.use("/produtos", produtosRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});