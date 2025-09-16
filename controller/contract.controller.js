const { sendErrorResponse } = require("../helpers/send.response.errors");
const {Op} = require("sequelize")
const Contracts = require("../models/contracts");
const Worker = require("../models/worker");
const Company = require("../models/company");
const User = require("../models/user");
const Worker_workTime = require("../models/worker_workTime");
const Company_workTime = require("../models/company_workTime");

const CreateContracts = async (req, res) => {
  try {
    const {
      duration_minut,
      start_time,
      location,
      userId,
      workerId,
      companyId,
    } = req.body;
    const filtr1 = await User.findByPk(userId);
    if (!filtr1) {
      return sendErrorResponse(
        { message: "Bunday nomli Client mavjud emas" },
        res,
        400
      );
    }else{
        if(filtr1.role != "client"){
            return sendErrorResponse({message: "Faqat clientlar cantract tuza oladi"}, res,400)
        }
    }
    const nowTime = Date.now()
    if(nowTime >= start_time){
        return sendErrorResponse({message: "Vaqt notog'ri kiritilgan"})
    }
    const duration = Number(duration_minut)
    const startData = new Date(start_time)
    const end_time = new Date(startData.getTime() + duration * 60 * 1000);

    let price
    if(workerId){
        const busy_time = await Worker_workTime.findOne({
            where: {
              workerId,
              start_time: { [Op.lt]: end_time },
              end_time: { [Op.gt]: startData }
            }
          })
        if(busy_time){
            return sendErrorResponse({message: "Workernin ish vaqti bor"}, res, 400)
        }
        const worker = await Worker.findByPk(workerId)
        price = worker.price * (duration_minut / 60)
    }
    if(companyId){
        const busy_time = await Company_workTime.findOne({
            where: {
              companyId,
              start_time: { [Op.lt]: end_time },
              end_time: { [Op.gt]: startData }
            }
          })
        if(busy_time){
            return sendErrorResponse({message: "company ning ish vaqti bor"}, res, 400)
        }
        const company = await Company.findByPk(companyId)
        price = company.price * (duration_minut / 60)
    }

    const newContract = await Contracts.create({duration_minut,
        start_time,
        end_time,
        location,
        price,
        userId,
        workerId,
        companyId,});

    res.status(201).json({
      message: "Success",
      data: newContract,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contracts.findAll({
      include: [
        {model: Worker,  as: "worker",attributes: ["name", "role", "price"],},
        {model: Company, as:"copmany", attributes: ["company_name", "price"]},
        {model: User, as:"user", attributes: ["name", "id"]}
      ]
    });
    if (contracts.length == 0) {
      return sendErrorResponse(
        { message: "Hali Contracts mavjud emas" },
        res,
        204
      );
    }
    res.status(200).json({
      message: "Success",
      data: contracts,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};


const findByIdContracts = async (req, res) => {
  try {
    const id = req.params.id;
    const contract = await Contracts.findByPk(id,{
        include: [
          {model: Worker, attributes: ["name", "role", "price"],},
          {model: Company, attributes: ["company_name", "price"]},
          {model: User, attributes: ["name", "id"]}
        ]
      });
    if (!contract) {
      return sendErrorResponse(
        { message: "Bunday contract mavjud emas" },
        res,
        404
      );
    }
    res.status(200).send({
      message: "Success",
      data: contract,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};

const updateContract = async (req, res) => {
  try {
    const {  duration_minut,
        start_time,
        location,
        userId,
        workerId,
        companyId, } = req.body;
    const id = req.params.id;

    const contract = await Contracts.findByPk(id);
    if (!contract) {
      return sendErrorResponse(
        { message: "Bunday contract mavjud emas" },
        res,
        404
      );
    }
    
    const filtr1 = await User.findByPk(userId);
    if (!filtr1) {
      return sendErrorResponse(
        { message: "Bunday nomli Client mavjud emas" },
        res,
        400
      );
    }else{
        if(filtr1.role != "client"){
            return sendErrorResponse({message: "Faqat clientlar cantract tuza oladi"}, res,400)
        }
    }

    const end_time = new Date(start_time.getTime() + duration * 60 * 1000);

    let price
    if(workerId){
        const busy_time = await Worker_workTime.findOne({where: {start_time}})
        if(busy_time.workerId == workerId){
            return sendErrorResponse({message: "Workernin ish vaqti bor"}, res, 400)
        }
        const worker = await Worker.findByPk(workerId)
        price = worker.price * (duration_minut / 60)
        await Worker_workTime.create(start_time,end_time,workerId)
        const id = worker.id
        await Worker_workTime.destroy({where: {id}})
    }
    if(companyId){
        const busy_time = await Company_workTime.findOne({where: {start_time}})
        if(busy_time.companyId == companyId){
            return sendErrorResponse({message: "company ning ish vaqti bor"}, res, 400)
        }
        const company = await Company.findByPk(companyId)
        price = company.price * (duration_minut / 60)
        await Company_workTime.create({start_time, end_time, companyId})
        const id = company.id
        await Company_workTime.destroy({where: {id}})
    }

    const updatedContact = await Contracts.update(
      { duration_minut,
        start_time,
        end_time,
        location,
        price,
        userId,
        workerId,
        companyId, },
      {
        where: { id },
        returning: true,
      }
    );
    res.status(200).send({
      message: "Success",
      data: updatedContact,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};

const delContracts = async (req, res) => {
  try {
    const id = req.params.id;
    const filtr = await Contracts.findByPk(id);
    if (!filtr) {
      return sendErrorResponse(
        { message: "Bunday Contract mavjud emas" },
        res,
        400
      );
    }
    await Contracts.destroy({ where: { id } });
    res.status(204).send({
      message: "Deleted seccessfully",
      statusCode: 204,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};

module.exports = {
  CreateContracts,
  getAllContracts,
  findByIdContracts,
  updateContract,
  delContracts,
};
