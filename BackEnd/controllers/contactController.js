const Contact=require('..models/contactSchema')
const mongoose = require('mongoose')

//get all contacts
const getContacts = async (req, res) => {
    const contacts = await Contact.find({}).sort({createdAt: -1})

    res.status(200).json(users)
    
}


//get a single contact
const getContact = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no such contact'})
    }

    const contact = await Contact.findById(id)

    if (!user) {
        return res.status(400).json({error: 'no such contact'})
    }

    res.status(200).json(contact)
}

//create a new contact
const createContact = async (req, res) => {
    const {name, email, password}=req.body

    //add doc to db
    try{
        const contact = await Contact.create({name, email, password})
        res.status(200).json({contact})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

// delete a contact
const deleteContact = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'no such contact'})
    }

    const contact = await Contact.findOneAndDelete({_id:id})

    if (!contact) {
        return res.status(400).json({error: 'no such contact'})
    }

    res.status(200).json(contact)
}

// update a contact
const updateContact = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'no such contact'})
    }

    const contact = await Contact.findOneAndUpdate({_id:id}, {
        ...req.body
    })

    if(!contact) {
        return res.status(400).json({error: 'no such contact'})
    }

    res.status(200).json(user)
}


module.exports = {
    getContacts,
    getContact,
    createContact,
    deleteContact,
    updateContact
}