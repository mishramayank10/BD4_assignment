let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let db;

(async () => {
  db = await open({
    filename: './BD4_A/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      res.status(404).json({ message: 'No restaurants found ' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchRestaurantsById(id);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found for id ' + id });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found for cuisine ' + cuisine });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function restaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await restaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found ' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function sortedRestaurants() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sorted-by-rating', async (req, res) => {
  try {
    let results = await sortedRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchDishesById(id);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found for id ' + id });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function dishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ? ';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await dishesByFilter(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found ' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function dishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sorted-by-price', async (req, res) => {
  try {
    let results = await dishesSortedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
