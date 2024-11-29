import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import exp from "constants";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?';

app.get("/", (req, res) => {
    res.render("index.ejs", {
        contentImage: null,
        dishName: null,
        category: null,
        area: null,
        link: null,
    }); // Render with empty data initially
});

app.get("/search", async (req, res) => {
    try {
        const name = req.query.name; // Access the query parameter
        const request = await axios.get(`${API_URL}s=${name}`);
        const meal = request.data.meals ? request.data.meals[0] : null;

        if (!meal) {
            // If no meal is found
            return res.render("index.ejs", {
                contentImage: null,
                dishName: "No meal found",
                category: null,
                area: null,
                link: null,
            });
        }

        // Extract data for the first meal
        const dish = meal.strMeal;
        const dishCategory = meal.strCategory;
        const dishArea = meal.strArea;
        const image = meal.strMealThumb;
        const link = meal.strYoutube;

        res.render("index.ejs", {
            contentImage: image,
            dishName: dish,
            category: dishCategory,
            area: dishArea,
            link: link,
        });
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs", {
            contentImage: null,
            dishName: "Error fetching meal",
            category: null,
            area: null,
            link: null,
        });
    }
});


app.listen(3000, (req, res) => {
    console.log("server running on port 3000....");
});