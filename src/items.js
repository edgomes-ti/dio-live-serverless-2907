"use strict";

const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "ItemTable";

// Esta função busca um item pelo seu ID na tabela "ItemTable" do DynamoDB
// e retorna um objeto JSON com as informações do item encontrado.
// Para usar esta função, é necessário passar o ID do item como parâmetro na URL.
const fetchItem = async (event) => {
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb.get({
      TableName: tableName,
      Key: { id },
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item não encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao buscar o item" }),
    };
  }
};

// Esta função busca todos os itens da tabela "ItemTable" do DynamoDB
// e retorna um array de objetos JSON com as informações de cada item encontrado.
const fetchItems = async () => {
  try {
    const result = await dynamodb.scan({
      TableName: tableName,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao buscar os itens" }),
    };
  }
};

// Esta função insere um novo item na tabela "ItemTable" do DynamoDB
// e retorna um objeto JSON com as informações do item inserido.
const insertItem = async (event) => {
  const { nome, descricao } = JSON.parse(event.body);

  const id = Date.now().toString();

  try {
    await dynamodb.put({
      TableName: tableName,
      Item: {
        id,
        nome,
        descricao,
      },
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        id,
        nome,
        descricao,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao inserir o item" }),
    };
  }
};

// Esta função atualiza um item na tabela "ItemTable" do DynamoDB
// e retorna um objeto JSON com as informações do item atualizado.
// Para usar esta função, é necessário passar o ID do item como parâmetro na URL.
const updateItem = async (event) => {
  const { id } = event.pathParameters;
  const { nome, descricao } = JSON.parse(event.body);

  try {
    await dynamodb.update({
      TableName: tableName,
      Key: { id },
      UpdateExpression: "SET nome = :nome, descricao = :descricao",
      ExpressionAttributeValues: {
        ":nome": nome,
        ":descricao": descricao,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        id,
        nome,
        descricao,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao atualizar o item" }),
    };
  }
};

