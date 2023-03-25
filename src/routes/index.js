const { default: axios } = require('axios');
const { Router, response } = require('express');
const { format } = require('morgan');
const { Op } = require('sequelize');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// const { getAll, getRecipesFromDB } = require('../utils/getRecipes'); 

const { Recipe, Diet } = require('../db.js')
const { APIKEY } = process.env;

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


const getApiInfo = async () => {
    
    // let recipesArray = [];
    
    try {
        const apiURL = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&addRecipeInformation=true&number=100`)
        
        // console.log("ESTAS son las promesas ", apiURL);
        // console.log("este es el map" , apiURL.data.results[0])

        const apiRecipes = apiURL.data?.results.map(element => {
            // console.log("ELEMENT: " , element)
            return {
                id: element.id,
                name: element.title,
                image: element.image,
                summary: element.summary,
                // spoonacularScore: element.spoonacularScore,
                healthScore: element.healthScore,
                diets: element.diets.map(each => ({ name: each })),
                dishTypes: element.dishTypes, 
                steps: element.analyzedInstructions[0]?.steps.map(each => { return each.step })
            }
        })
        // console.log("apiRecipes " ,apiRecipes)
        return apiRecipes;
    }
    catch(error){
        console.log(error)
    }
   
}

const getDbInfo = async () => {
    
    return await Recipe.findAll({
        include: {
            model: Diet,
            attributes: ['name'], through: {attributes: []},
        }
    })
}

const getAllRecipes = async () => {
    try {
        const apiInfo = await getApiInfo();
        // console.log("apiINFO en getAllRecipes", apiInfo);
        const dBInfo = await getDbInfo();
        // console.log("dbInfo en getAllRecipes: ", dBInfo);
        const concatInfo = apiInfo.concat(dBInfo);

        return concatInfo;
    }catch(error)
    {
       console.log(error);
        // return (error.message)
    }
}


router.get('/recipes', async (req, res) => {
    console.log('hola');
    const { name } = req.query;
    // const apiInfo = await getApiInfo();
    //   console.log('Api INFO ', apiInfo);
    // res.status(200).json({apiInfo: apiInfo});
    const allRecipes =  await getAllRecipes();
    // console.log("allRecipes tiene: ", allRecipes)
    try {
        if(name){
            let nameRecipes = allRecipes.filter(r => {
                return r.name.toLowerCase().includes(name.toLowerCase())}
            );
            // console.log("nameRecipes: ", nameRecipes);
            nameRecipes.length ? res.status(200).send(nameRecipes) : 
                                 res.status(404).json({error: 'Receta no encontrada'});
        }else 
        {
            return res.status(200).send(allRecipes);
        }
    }
    catch(error){
        return res.status(404).send('Error 404');
    }

})



router.get('/recipes/:id', async (req, res) => {

    const { id } = req.params;
    
    const recipesById = await getAllRecipes();

    try {
        if(id){
            // console.log("Id: ", id)
            let recipeId = await recipesById.find(r => r.id == id.toString());
            // console.log("RecipeId: ", recipeId)
            // recipeId.length? res.status(200).json(recipeId) : res.status(400).json({msg: "Id inexistente"}) 
            res.status(200).json(recipeId)
        }
    }
    catch (error){
        console.log(error)
    }
})

router.get('/diets', async (req,res) => {
    
  
    const diets = await Diet.findAll();
    // console.log("diets ", diets)
    return res.status(200).send(diets);    
});
 
router.post('/recipes', async (req, res) => { 

    const { name, summary, healthScore, dishTypes, steps, image, diets } = req.body;

    // if(!name || !summary || !healthScore || !puntuation || !steps)
    //    return res.status(400).json({msg: 'Faltan datos'});
    
    try {
        const newRecipe = await Recipe.create({name, summary, healthScore, dishTypes, steps, image})
        const newDiet = await Diet.findAll({
            where: {
                name: diets
            } 
        })
        // console.log("Prototipo: ", newRecipe.__proto__);
        await newRecipe.addDiet(newDiet);
        res.status(200).send('Receta creada exitosamente');
    }catch(error){
        console.log(error);
    }
   
});

module.exports = router;