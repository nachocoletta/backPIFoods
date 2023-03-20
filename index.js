//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Diet } = require('./src/db.js');

const PORT = process.env.PORT || 3001




function preChargeDiets(){

let dietsApi = [
        {name:'gluten free'}, 
        {name:'dairy free'}, 
        {name:'lacto ovo vegetarian'}, 
        {name:'vegan'}, 
        {name:'paleolithic'}, 
        {name:'primal'}, 
        {name:'whole 30'},
        {name:'pescatarian'},
        {name:'ketogenic'},
        {name:'fodmap friendly'},
        {name:'vegetarian'}
    ];

    
    // let dietsApi = [
    //   {id: 1, name:'gluten free'}, 
    //   {id: 2, name:'dairy free'}, 
    //   {id: 3, name:'lacto ovo vegetarian'}, 
    //   {id: 4, name:'vegan'}, 
    //   {id: 5, name:'paleolithic'}, 
    //   {id: 6, name:'primal'}, 
    //   {id: 7, name:'whole 30'},
    //   {id: 8, name:'pescatarian'},
    //   {id: 9, name:'ketogenic'},
    //   {id:10, name:'fodmap friendly'},
    //   {id:11, name:'vegetarian'}
    // ];

    for(let index in dietsApi){
        // console.log(dietsApi[index].name);
        Diet.findOrCreate(
            {
                where: {
                    name: dietsApi[index].name
                }
            }
        )
    }
}

// Syncing all the models at once.
// conn.sync({ force: false }).then(async () => {
//   await preChargeDiets();
//   server.listen(3001, () => {
//     console.log('%s listening at 3001'); // eslint-disable-line no-console
//   });
// });

conn.sync({ force: false }).then(() => {
    preChargeDiets();
    server.listen(PORT, () => {
      console.log("%s listening at 3000"); // eslint-disable-line no-console
    });
  });