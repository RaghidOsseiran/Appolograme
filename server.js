const fs = require('fs');
const express = require('express');
const host = 'localhost';
const port = 8080 ;

const app = express();


const { Client } = require('pg');
const { normalize } = require('path');

const client = new Client({
    user: 'postgres',
    password: 'Hunterxhunter04',
    database: 'photo',
    port: 5432
})

client.connect()
.then(() => {
    console.log('Connected to database');
})
.catch((e) => {
    console.log('Error connection to database');
    console.log(e);
});


app.use('/public', express.static('public'));

app.get('/', (req,res) => {
    res.redirect('/mur-images');
})

app.get('/mur-images/', async (req,res) =>{
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos ORDER BY id");
        const sqlQuery2 = await client.query("SELECT id FROM photos ORDER BY id");
        const fichierImage = sqlQuery.rows.map(row => row.fichier);
        const fichierID = sqlQuery2.rows.map(row => row.id);

        res.render('mur', {images: fichierImage, id: fichierID});

    } catch(e) {
        console.log(e);
    }
});


app.get('/image/:id', async (req,res) => {
    const id = req.params.id
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos WHERE id = "+id+"");
        const sqlRes = sqlQuery.rows[0].fichier;

        const sqlQueryNom = await client.query("SELECT nom FROM photos WHERE id="+id+"");
        const sqlQueryNomRes = (sqlQueryNom.rows[0].nom);
        console.log(sqlQueryNomRes.toString());

        const sqlComment = await client.query("SELECT texte from commentaires where id_photo="+id+"");

        if (sqlComment.rowCount === 0){
            const sqlCommentRes = "NO COMMENT";
            res.render('image', {image: sqlRes, id, nom: sqlQueryNomRes.toString(), Comments: sqlCommentRes/*.toString()*/});
        } else {
            const sqlCommentRes = sqlComment.rows.map(row => row.texte);
            res.render('image', {image: sqlRes, id, nom: sqlQueryNomRes.toString(), Comments: sqlCommentRes/*.toString()*/});
        }
    } catch(e) {
        console.log(e);
    }
})

app.post('/image/:id', async(req,res) => {
    const id = req.params.id
    try{
        let data;

        req.on('data', (dataChunk) =>{
            data += dataChunk.toString();
        });

        req.on('end', async () =>{
            try{
                const Split = data.split('=');
                const NewComment = Split[1].replace("+"," ");
                const sqlInsert = await client.query("INSERT INTO commentaires (texte, id_photo) VALUES ( '"+NewComment+"' , "+id+" )");
            } catch(e) {
                console.log(e);
            }
            
        })

        const sqlQuery = await client.query("SELECT fichier FROM photos WHERE id = "+id+" ORDER BY id");
        const sqlRes = sqlQuery.rows[0].fichier;

        const sqlQueryNom = await client.query("SELECT nom FROM photos WHERE id="+id+"");
        const sqlQueryNomRes = (sqlQueryNom.rows[0].nom);
        console.log(sqlQueryNomRes.toString());

        const sqlComment = await client.query("SELECT texte from commentaires where id_photo="+id+"");

        if (sqlComment.rowCount === 0){
            const sqlCommentRes = "NO COMMENT";
            res.render('image', {image: sqlRes, id, nom: sqlQueryNomRes.toString(), Comments: sqlCommentRes/*.toString()*/});
        } else {
            const sqlCommentRes = sqlComment.rows.map(row => row.texte);
            res.render('image', {image: sqlRes, id, nom: sqlQueryNomRes.toString(), Comments: sqlCommentRes/*.toString()*/});
        }
    } catch(e) {
        console.log(e);
    }
    
})


app.get('/image/:id/liked', async (req,res) => {
    const id = req.params.id;
    const sqlLike = await client.query("UPDATE photos SET likes = likes + 1 WHERE photos.id =" + id);
    res.redirect('/image/' + id);
})



app.get('/mur-images/date', async (req,res) => {
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos ORDER BY date DESC");
        const sqlQuery2 = await client.query("SELECT id FROM photos ORDER BY date DESC");
        const fichierImage = sqlQuery.rows.map(row => row.fichier);
        const fichierID = sqlQuery2.rows.map(row => row.id);

        res.render('mur', {images: fichierImage, id: fichierID});

    } catch(e) {
        console.log(e);
    }
})


app.get('/mur-images/like', async (req,res) => {
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos ORDER BY likes DESC");
        const sqlQuery2 = await client.query("SELECT id FROM photos ORDER BY likes DESC");
        const fichierImage = sqlQuery.rows.map(row => row.fichier);
        const fichierID = sqlQuery2.rows.map(row => row.id);

        res.render('mur', {images: fichierImage, id: fichierID});

    } catch(e) {
        console.log(e);
    }
})

app.get('/mur-images/photographe', async (req,res) => {
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos ORDER BY id_photographe");
        const sqlQuery2 = await client.query("SELECT id FROM photos ORDER BY id_photographe");
        const fichierImage = sqlQuery.rows.map(row => row.fichier);
        const fichierID = sqlQuery2.rows.map(row => row.id);

        res.render('mur', {images: fichierImage, id: fichierID});

    } catch(e) {
        console.log(e);
    }
})

app.get('/mur-images/orientation', async (req,res) => {
    try{
        const sqlQuery = await client.query("SELECT fichier FROM photos ORDER BY orientation");
        const sqlQuery2 = await client.query("SELECT id FROM photos ORDER BY orientation");
        const fichierImage = sqlQuery.rows.map(row => row.fichier);
        const fichierID = sqlQuery2.rows.map(row => row.id);

        res.render('mur', {images: fichierImage, id: fichierID});

    } catch(e) {
        console.log(e);
    }
})





app.get('/add-image', async(req,res) => {
    try{
        console.log('in get image');
        res.render('form');
    } catch (e) {
        console.log(e)
    }
})




app.post('/add-image', async (req,res) =>{
    console.log('in add image');
    try{

        let dataAdd;
        console.log(' in the try ');

        req.on('data', (dataChunk2) =>{
            console.log('in data fuck');
            dataAdd += dataChunk2.toString();
        })


        req.on('end', async() =>{
            try{
                console.log(dataAdd)
                const Split = dataAdd.split('&');
                const imgName = Split[0].split('=')[1];
                console.log("This is the image name" +imgName);
                const imgDate = Split[1].split('=')[1];
                console.log("This is the image Date" +imgDate);
                const imgOri = Split[2].split('=')[1];
                console.log("This is the image Ori" +imgOri);
                const imgNb = Split[3].split('=')[1];
                const filePath = "image"+imgNb+".jpg"
                const imgPhotog = Split[4].split('=')[1];
                console.log("This is the image Photog" +imgPhotog);

                const sqlAddImg = await client.query("INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('"+imgName+"','"+imgDate+"', "+imgOri+" ,'"+filePath+"', "+imgPhotog+" )");
                

            } catch (e) {
                console.log(e)
            }
        })

        res.render('form');
    } catch(e) {
        console.log(e)
    }
})




// setup EJS
app.set('view engine', 'ejs');
app.set('views', './ejs-templates');

app.listen(port, host, () =>{
    console.log(`Server running at http://${host}:${port}/`);
})