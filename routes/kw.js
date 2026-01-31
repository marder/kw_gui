const express = require('express')
const router = express.Router()
const Kw = require('../models/kw')
const { calculateNr } = require('../lib/algo')

//getting all
router.get('/', async (req, res) => {
    try {
        const kw = await Kw.find()
        res.json(kw)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//getting one
router.get('/:id', getKw, (req, res) => {
    res.json(res.kw)
})

//creating one
router.post('/', async (req, res) => {

    const kw = new Kw({
        signature: req.body.signature,
        oldKw: req.body.oldKw,
        newKw: req.body.newKw
    })

    try {
        const newKw = await kw.save()
        res.status(201).json(newKw)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//updating one
router.patch('/:id', getKw, async (req, res) => {
    if (req.body.oldKw != null) {
        res.kw.oldKw = req.body.oldKw
    }
    if (req.body.newKw != null) {
        res.kw.newKw = req.body.newKw
    }
    try {
        const updatedKw = await res.kw.save()
        res.json(updatedKw)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//deleting one
router.delete('/:id', getKw, async (req, res) => {
    try {
        await res.kw.remove()
        res.json({ message: "Deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/convert', async (req, res) => {
    const { court, old } = req.body;

    if (!court || !old) {
        return res.status(400).json({ message: "Court and old number are required" });
    }

    if (court.length !== 4) {
        return res.status(400).json({ message: "Court number must be 4 characters long" });
    }

    if (!/^[0-9]+$/.test(old)) {
        return res.status(400).json({ message: "Old number must contain only digits" });
    }

    try {
        const control = calculateNr(court, old);
        const filling = "0".repeat(8 - old.length);
        const newNumber = `${court}/${filling}${old}/${control}`;
        
        const kw = new Kw({
            signature: court,
            oldKw: old,
            newKw: newNumber
        });

        const newKwEntry = await kw.save();
        res.json({ newKw: newNumber, savedEntry: newKwEntry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getKw(req, res, next) {
    let kw
    try {
        kw = await Kw.findById(req.params.id)
        if (kw == null) {
            return res.status(404).json({ message: "Cannot find kw" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.kw = kw
    next()
}

module.exports = router