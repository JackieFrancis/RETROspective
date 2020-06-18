const router = require('express').Router()
const {User} = require('../db/models')
const {Game} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
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
