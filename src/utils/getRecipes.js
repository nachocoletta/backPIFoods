const axios = require ('axios');
const { Recipe } = require('../db');
const { Op } = require('sequelize');


async function getRecipesFromApi(element) {
    const recipesApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&number=100`);
    // const recipesApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.APIKEY}&query=${element}`);
    
    console.log("ESTO ME DEVUELVE LA APP", recipesApi.data.results);  
    return recipesApi.data.results;
}

async function getRecipesFromDB(element){   
    
    const recipesDB = await Recipe.findAll({
        where: {
            name: { [Op.substring]: element }
        } 
    });
    
    // console.log(element)
    // console.log(recipesDB);
    return recipesDB;
}

async function getAll(element){
    const fromDb = await getRecipesFromDB(element);
    const fromApi = await getRecipesFromApi(element);
    // const data = await Promise.all([getRecipesFromDB(element), getRecipesFromApi(element)]);

    return fromApi;
}

module.exports = { getAll }