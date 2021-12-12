import asyncHandler from '../middleware/asyncHandler.js';
import ResponseError from '../utils/ResponseError.js';

import Contact from '../models/Contact.js';


/**
 * Find all contacts
 * @route    GET /api/v1/contacts
 * @access   Public
 */
const findAll = asyncHandler(async (req, res, next) => {
  const data = await Contact.find();
  res.status(200).json({ success: true, data: data });
});

/**
 * Find contact by ID
 * @route    GET /api/v1/contacts/:id
 * @access   Public
 */
const findById = asyncHandler(async (req, res, next) => {
  const data = await Contact.findById(req.params.id);
  res.status(200).json({ success: true, data: data });
});

/**
 * Create a contact in the database
 * @route    POST /api/v1/contacts
 * @access   Private
 */
const create = async (req, res, next) => {
  try {
    const data = await Contact.create(req.body);
    res.status(201).json({ success: true, data: data });
  } 
  catch(err) { 
    next(err);
  }
};

/**
 * Update a contact in the database
 * @route    PPUT /api/v1/contacts/:id
 * @access   Private
 */
const update = async (req, res, next) => {
  try {

    const data = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      next(new ResponseError(`contact not found with id ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: data });

  } 
  catch(err) { 
    next(err);
  }

};

export { 
  findAll, 
  findById, 
  create, 
  update 
};
