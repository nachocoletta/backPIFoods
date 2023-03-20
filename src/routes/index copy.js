// const { default: axios } = require('axios');
// const { Router } = require('express');
// const { format } = require('morgan');
// const { Op } = require('sequelize');
// // Importar todos los routers;
// // Ejemplo: const authRouter = require('./auth.js');

// // const { getAll, getRecipesFromDB } = require('../utils/getRecipes'); 

// const { Recipe, Diet } = require('../db.js')
// const { APIKEY } = process.env;

// const router = Router();

// // Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);

// // router.get('/', (req, res) => {
// //     res.send('Hola');
// // });

// const getApiInfo = async () => {
    
//     // let recipesArray = [];
    
//     const apiURL = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&addRecipeInformation=true&number=100`);
//     // console.log("ESTA son las promesas ", apiURL);
//     // console.log("este es el map" , apiURL.data.results[0])

//     const apiRecipes = apiURL.data?.results.map(element => {
//         return {
//             id: element.id,
//             name: element.title,
//             image: element.image,
//             summary: element.summary,
//             // spoonacularScore: element.spoonacularScore,
//             healthScore: element.healthScore,
//             diets: element.diets.map(each => ({ name: each })),
//             dishTypes: element.dishTypes, 
//             steps: element.analyzedInstructions[0]?.steps.map(each => { return each.step })
//         }
//     })

//     return apiRecipes;
//     // console.log("esto devuelve la api: ", apiURL.data.results) ;
//     // // return apiURL;
//     // const apiInfo = await apiURL.data.results.map( u => axios.get(u.url));
//     // // console.log("Esto es apiInfo en getApiInfo: ", apiInfo)
//     // // return apiInfo;
    
//     // let results = axios.all(apiInfo)
//     // .then( 
//     //     recipe => { 
//     //         recipe.map( r => {
//     //             recipesArray.push({
//     //                 name: r.title,
//     //                 summary: r.summary, 
//     //                 healthScore: r.healthScore,
//     //                 image: r.image,
//     //                 id: r.id,
//     //                 steps: r.analyzedInstructions[0]?.steps.map(el => {
//     //                     return {
//     //                         number: el.number,
//     //                         step: el.step
//     //                     }
//     //                 }),
//     //                 diets: r.diets.map(r => r.diet)
//     //             })
//     //         })
//     //      console.log("Arreglo de recetas ", recipesArray)
//     //      return recipesArray;
//     //     }
//     // )
//     // .catch(error => { console.log("Tipo de ERROR: ", error);
//     //     // res.status(404).send("Error en la promesa");
//     //     // throw new Error("Error de la promesa")
//     // })
//     // // res.status(404).send("Error en la promesa");
//     // console.log("hasta aca ejecuta RESULTS", results);
//     // return results;
    
   
    
// //     const apiInfo = await apiURL.data.map(recipe => {
// //         return {
// //             name: recipe.title,
// //             summary: recipe.summary, 
// //             healthScore: recipe.healthScore,
// //             image: recipe.image,
// //             id: recipe.id,
// //             steps: recipe.analyzedInstructions[0]?.steps.map(el => {
// //                 return {
// //                     number: el.number,
// //                     step: el.step
// //                 }
// //             })
// //         }
        
// //     })
// //     return apiInfo;
// }

// const getDbInfo = async () => {
    
//     return await Recipe.findAll({
//         include: {
//             model: Diet,
//             attributes: ['name'], through: {attributes: []},
//         }
//     })
// }

// const getAllRecipes = async () => {
//     const apiInfo = await getApiInfo();
//     // console.log("apiINFO en getAllRecipes", apiInfo);
//     const dBInfo = await getDbInfo();
//     // console.log("dbInfo en getAllRecipes: ", dBInfo);
//     const concatInfo = apiInfo.concat(dBInfo);

//     return concatInfo;
// }


// router.get('/recipes', async (req, res) => {

//     const { name } = req.query;
//     // const apiInfo = await getApiInfo();
//     // console.log('Api INFO ', apiInfo);
//     // res.status(200).json({apiInfo: apiInfo});
//     const allRecipes = await getAllRecipes();
    
//     if(name){
//         let nameRecipes = allRecipes.filter(r => {
//             r.name.toLowerCase().includes(name.toLowerCase())}
//         );
//         // console.log("nameRecipes: ", nameRecipes);
//         nameRecipes.length ? res.status(200).send(nameRecipes) : 
//                              res.status(404).send('Receta no encontrada');
//     }else 
//     {
//         return res.status(200).send(allRecipes);
//     }

  

// })



// router.get('/recipes/:idReceta', async (req, res) => {

//     const { idReceta } = req.params;
    
//     const recipesById = await getAllRecipes();

//     if(idReceta){
//         let recipeId = await recipesById.filter(r => r.id == idReceta);
//         recipeId.length? res.status(200).json(recipeId) : res.status(400).json({msg: "Id inexistente"}) 
//     }

// })

// async function buscarDietas() {
//     const apiURL = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&addRecipeInformation=true&number=100`);
//     const dietsApi = apiURL.data?.results.map(el => el.diets);
//     const dietSinRepetir = dietsApi.flat();

//     const newSet = [...new Set(dietSinRepetir)];
//     // console.log("New set", newSet)
//     const diet = newSet.map(id => ({id}));
//     // console.log("diet sin repetir ", dietSinRepetir)
//     // console.log("diet ", diet)
//     await Diet.bulkCreate(diet);
// }
// router.get('/diets', async (req,res) => {
    
//     // const apiURL = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&addRecipeInformation=true&number`);
//     // const dietsApi = apiURL.data?.results.map(el => el.diets);
//     // const dietSinRepetir = dietsApi.flat();

//     // const newSet = [...new Set(dietSinRepetir)];
//     // const diet = newSet.map(name => {
//     //     name
//     // });
    
//     // console.log("diet ", diet)
//     // await Diet.bulkCreate(diet);
//     // buscarDietas();

//     const diets = await Diet.findAll();
//     // console.log("diets ", diets)
//     return res.status(200).send(diets);
//     // let dietsApi = [
//     //     {name:'gluten free'}, 
//     //     {name:'dairy free'}, 
//     //     {name:'lacto ovo vegetarian'}, 
//     //     {name:'vegan'}, 
//     //     {name:'paleolithic'}, 
//     //     {name:'primal'}, 
//     //     {name:'whole 30'},
//     //     {name:'pescatarian'},
//     //     {name:'ketogenic'},
//     //     {name:'fodmap friendly'},
//     //     {name:'vegetarian'}
//     // ];


//     // // ...dietsApi[index].name
//     // for(let index in dietsApi){
//     //     // console.log(dietsApi[index].name);
//     //     Diet.findOrCreate(
//     //         {
//     //             where: {
//     //                 name: dietsApi[index].name
//     //             }
//     //         }
//     //     )
//     // }
//     // console.log(`${index}: ${dietsApi[index].name}`)
    
//     // await Diet.bulkCreate(dietsApi);  
//     // const allDiets = await Diet.findAll();

//     // return res.status(200).json(allDiets); 
    
// });
// // Los campos mostrados en la ruta principal para cada receta (
// //  Nivel de "comida saludable" (health score)
// //  Paso a paso

//  // 
// router.post('/recipes', async (req, res) => { 

//     const { name, summary, healthScore, dishTypes, steps, image, diets } = req.body;

//     // if(!name || !summary || !healthScore || !puntuation || !steps)
//     //    return res.status(400).json({msg: 'Faltan datos'});
    
//     try {
//         const newRecipe = await Recipe.create({name, summary, healthScore, dishTypes, steps, image})
//         const newDiet = await Diet.findAll({
//             where: {
//                 name: diets
//             } 
//         })
//         // console.log("Prototipo: ", newRecipe.__proto__);
//         await newRecipe.addDiet(newDiet);
//         res.status(200).send('Receta creada exitosamente');
//     }catch(error){
//         console.log(error);
//     }
   
// });

// module.exports = router;