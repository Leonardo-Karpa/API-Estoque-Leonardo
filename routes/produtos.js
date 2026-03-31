// importa o express
const express = require("express");
const router = express.Router(); 
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/produtos.json");

// função para ler os produtos
function lerDados() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// funcao para salvar os produto
function salvarDados(dados) {
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
}

// rotas
router.get("/", (req, res) => {
    try {
        const produtos = lerDados();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao ler produtos" });
    }
});
// retorna um expecifico
router.get("/:id", (req, res) => {
    try {
        const produtos = lerDados();
        const produto = produtos.find(p => p.id == req.params.id);

        if (!produto) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        res.json(produto);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar produto" });
    }
});
// post cria
router.post("/", (req, res) => {
    try {
        const { nome, descricao, preco, quantidade, categoria } = req.body;

        if (!nome || preco === undefined) {
            return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
        }

        if (typeof preco !== "number" || preco <= 0) {
            return res.status(400).json({ erro: "Preço deve ser número maior que zero" });
        }

        if (quantidade !== undefined && (!Number.isInteger(quantidade) || quantidade < 0)) {
            return res.status(400).json({ erro: "Quantidade deve ser inteiro >= 0" });
        }

        const produtos = lerDados();
// cria um novo produto
        const novoProduto = {
            id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
            nome,
            descricao,
            preco,
            quantidade: quantidade || 0,
            categoria
        };

        produtos.push(novoProduto);
        salvarDados(produtos);

        res.status(201).json(novoProduto);

    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar produto" });
    }
});
// atualiza um produto existente
router.put("/:id", (req, res) => {
    try {
        const produtos = lerDados();
        const index = produtos.findIndex(p => p.id == req.params.id);

        if (index === -1) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        const { nome, descricao, preco, quantidade, categoria } = req.body;

        if (preco !== undefined && (typeof preco !== "number" || preco <= 0)) {
            return res.status(400).json({ erro: "Preço inválido" });
        }

        if (quantidade !== undefined && (!Number.isInteger(quantidade) || quantidade < 0)) {
            return res.status(400).json({ erro: "Quantidade inválida" });
        }

        const produtoAtualizado = {
            ...produtos[index],
            nome: nome ?? produtos[index].nome,
            descricao: descricao ?? produtos[index].descricao,
            preco: preco ?? produtos[index].preco,
            quantidade: quantidade ?? produtos[index].quantidade,
            categoria: categoria ?? produtos[index].categoria
        };

        produtos[index] = produtoAtualizado;
        salvarDados(produtos);

        res.json(produtoAtualizado);

    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
});
// deleta um produto
router.delete("/:id", (req, res) => {
    try {
        const produtos = lerDados();
        const index = produtos.findIndex(p => p.id == req.params.id);

        if (index === -1) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        produtos.splice(index, 1);
        salvarDados(produtos);

        res.json({ mensagem: "Produto removido com sucesso" });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao remover produto" });
    }
});

module.exports = router;