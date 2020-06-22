const router = require('express').Router()
const {Game} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll()
    res.json(games)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id)
    res.json(game)
  } catch (error) {
    next(error)
  }
})

router.post('/add-inventory-game', async (req, res, next) => {
  try {
    const newGame = await Game.create(req.body)
    res.json(newGame)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    //const updatedGame = await Game.update(req.body)
    const [numberOfAffectedRows, affectedRows] = await Game.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true,
      plain: true
    })
    if (affectedRows) {
      res.json(affectedRows)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
})
