const Tip = require('../models/Tip')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class TipsController{
  static async showTips(req, res){

    console.log(req.query)

    // check if user is searching
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    // order results, newest first
    let order = 'DESC'

    if (req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }

    Tip.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    })
      .then((data) => {
        let tipsQty = data.length

        if (tipsQty === 0) {
          tipsQty = false
        }

        const tips = data.map((result) => result.get({ plain: true }))

        res.render('tips/home', { tips, tipsQty, search })
      })
      .catch((err) => console.log(err))
  }

  static async dashboard(req, res){
    const userId = req.session.userid

    const user = await User.findOne({
      where:{
        id: userId,
      },
      include: Tip,
      plain: true,
    })

    if(!user){
      res.redirect('/login')
    }

    const tips = user.Tips.map((result) => result.dataValues)
   
    let emptyTips = false
    if (tips.length === 0 ){
      emptyTips = true
    }

    res.render('tips/dashboard', {tips, emptyTips})
  }

  static createTip(req, res){
    res.render('tips/create')
  }

  static async createTipSave(req, res){
    const tip = {
      title: req.body.title,
      UserId: req.session.userid
    }

    try{
      await Tip.create(tip)

      req.flash('message', 'Tip criada com sucesso')

      req.session.save(() => {
        res.redirect('/tips/dashboard')
      })
    } catch (error) {
      console.log('Aconteceu um erro: ' + error)
    }
  }

  static async removeTip(req, res){
    const id = req.body.id
    const UserId = req.session.userid

    try{
      await Tip.destroy({ where: {id: id, UserId: UserId}})

      req.flash('message', 'Tip removida com sucesso')

      req.session.save(() => {
        res.redirect('/tips/dashboard')
      })

    } catch (error) {
      console.log('Aconteceu um erro: ' + error)
    }
  }

  static async updateTip(req, res){
    const id = req.params.id

    const tip = await Tip.findOne({where: {id: id}, raw: true})

    res.render('tips/edit', {tip})
  }

  static async updateTipSave(req, res){
    const id = req.body.id

    const tip = {
      title: req.body.title,
    }

    try{
      await Tip.update(tip, {where: {id: id}})
      req.flash('message', 'Tip atualizada com sucesso!')

      req.session.save(() => {
        res.redirect('/tips/dashboard')
      })
    } catch (error) {
      console.log('Aconteceu um erro: ' + error)
    }
  }
}