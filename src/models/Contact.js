import mongoose from 'mongoose';

//https://mongoosejs.com/docs/middleware.html


const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Debe ingresar un nombre'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Debe ingresar un email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'El formato del email es invalido'],
        unique: true
    },
    phone: {
        type: String
    },
    description: {
        type: String,
        maxlength: [150, 'La descripción no puede tener más de 150 caracteres']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Contact', ContactSchema);