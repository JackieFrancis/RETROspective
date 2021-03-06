const router = require('express').Router()
const {User} = require('../db/models')
const {Game} = require('../db/models')
const {Cart} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(401)
    if (req.user.admin) {
      const users = await User.findAll({
        // explicitly select only the id and email fields - even though
        // users' passwords are encrypted, it won't help if we just
        // send everything to anyone who asks!
        attributes: ['id', 'email', 'admin'],
        order: ['id']
      })
      res.json(users)
    } else res.sendStatus(401)
  } catch (err) {
    next(err)
  }
})

router.put('/add-cart-item', async (req, res, next) => {
  try {
    const [user, game] = await Promise.all([
      User.findByPk(req.user.id),
      Game.findByPk(req.body.gameId)
    ])
    await user.addGame(game)
    const updatedUser = await User.findByPk(req.user.id, {
      include: [{model: Game}]
    })
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.put('/remove-cart-item', async (req, res, next) => {
  try {
    const [user, game] = await Promise.all([
      User.findByPk(req.user.id),
      Game.findByPk(req.body.gameId)
    ])
    await user.removeGame(game)
    const updatedUser = await User.findByPk(req.user.id, {
      include: [{model: Game}]
    })
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.put('/change-cart-quant', async (req, res, next) => {
  try {
    const item = await Cart.findOne({
      where: {gameId: req.body.gameId, userId: req.body.userId}
    })
    await item.changeQuant(req.body.value)
    const user = await User.findByPk(req.body.userId, {
      include: [{model: Game}]
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/checkout', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{model: Game}]
    })
    await user.removeGames(user.games)
    const checkedOutUser = await User.findByPk(req.user.id, {
      include: [{model: Game}]
    })
    res.json(checkedOutUser)
  } catch (error) {
    next(error)
  }
})
