const { sendErrorResponse } = require("../helpers/send.response.errors");
const {Op} = require("sequelize")
const Company_workTime = require("../models/company_workTime");
const Contracts = require("../models/contracts");
const Payments = require("../models/payments");
const Worker_workTime = require("../models/worker_workTime");

const CreatePayment = async (req, res) => {
  try {
    const {
        contractId,
        method,
        amount,
        paid_at
    } = req.body;

    let status = "pending"
    const contract = await Contracts.findByPk(contractId)
    if(!contract){
        return sendErrorResponse({message: "bunday contract mavjud emas"})
    }

    const debt = contract.price - amount
    
    if(debt <= 0){
        status = "completed"
        contract.is_active = true
        await contract.save()
        if(contract.workerId){
            const start_time = contract.start_time
            const end_time = contract.end_time
            const workerId = contract.workerId
            const busy_time = await Worker_workTime.findOne({
                where: {
                  workerId,
                  start_time: { [Op.lt]: end_time },
                  end_time: { [Op.gt]: start_time }
                }
              })
            if(busy_time){
                return sendErrorResponse({message: "Bu ish vaqti band qilib bolingan"}, res, 400)
            }
            await  Worker_workTime.create({start_time,end_time,workerId})
        }else if(contract.companyId){
            const start_time = contract.start_time
            const end_time = contract.end_time
            const companyId = contract.companyId
            const busy_time = await Company_workTime.findOne({
                where: {
                  companyId,
                  start_time: { [Op.lt]: end_time },
                  end_time: { [Op.gt]: start_time }
                }
              })
            if(busy_time){
                return sendErrorResponse({message: "Bu ish vaqti band qilib bolingan"}, res, 400)
            }
            await  Company_workTime.create({start_time,end_time,companyId})
        }
    }
    const newPayment = await Payments.create({contractId,
        method,
        amount,
        status,
        paid_at,
        debt
    });
    
    res.status(201).json({
      message: "Success",
      data: newPayment,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};
// async function destroyTime(id) {
//     try{
//         const payment = await Payments.findByPk(id)
//         if(payment.status == "pending"){
//             const contract = await Contracts.findByPk(payment.contractId)
//             contract.is_active = false
//             await contract.save()
//             if(contract.workerId){
//                 const workerId = contract.workerId
//                 const start_time = contract.start_time
//                 await Worker_workTime.destroy({where: {workerId: workerId,start_time: start_time}})
//             }else if(contract.companyId){
//                 const companyId = contract.companyId
//                 const start_time = contract.start_time
//                 await Company_workTime.destroy({where: {companyId: companyId,start_time: start_time}})
//             }
//         }
//     }catch(error){
//         return error
//     }
// }


const getAllPayments = async (req, res) => {
  try {
    const payment = await Payments.findAll({
      include: [
        {model: Contracts}
      ]
    });
    if (payment.length == 0) {
      return sendErrorResponse(
        { message: "Hali Payment mavjud emas" },
        res,
        204
      );
    }
    res.status(200).json({
      message: "Success",
      data: payment,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};


const findByIdPayments = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payments.findByPk(id,{
        include: [
          {model: Contracts}
        ]
      });
    if (!payment) {
      return sendErrorResponse(
        { message: "Bunday payment mavjud emas" },
        res,
        404
      );
    }
    res.status(200).send({
      message: "Success",
      data: payment,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(error, res, 500);
  }
};


module.exports = {
  CreatePayment,
  getAllPayments,
  findByIdPayments
};
