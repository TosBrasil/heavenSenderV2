import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateQueueService from "../services/QueueService/CreateQueueService";
import DeleteQueueService from "../services/QueueService/DeleteQueueService";
import ListQueuesService from "../services/QueueService/ListQueuesService";
import ShowQueueService from "../services/QueueService/ShowQueueService";
import UpdateQueueService from "../services/QueueService/UpdateQueueService";
import { isNil } from "lodash";
type QueueFilter = { companyId: number };
export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId: userCompanyId } = req.user;
  const { companyId: queryCompanyId } = req.query as unknown as QueueFilter;
  let companyId = userCompanyId;
  if (!isNil(queryCompanyId)) {
    companyId = +queryCompanyId;
  }
  const queues = await ListQueuesService({ companyId });
  return res.status(200).json(queues);
};
export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    color,
    typebotUrl, 
    typebotName,
    greetingMessage,
    outOfHoursMessage,
    schedules,
    chatbots
  } = req.body;
  const { companyId } = req.user;
  const queue = await CreateQueueService({
    name,
    color,
    typebotUrl, 
    typebotName,
    greetingMessage,
    companyId,
    outOfHoursMessage,
    schedules,
    chatbots
  });
  const io = getIO();
  io.emit(`company-${companyId}-queue`, { action: "update", queue });
  return res.status(200).json(queue);
};
export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueId } = req.params;
  const { companyId } = req.user;
  const queue = await ShowQueueService(queueId, companyId);
  return res.status(200).json(queue);
};
export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;
  const { companyId } = req.user;
  const queue = await UpdateQueueService(queueId, req.body, companyId);
  const io = getIO();
  io.emit(`company-${companyId}-queue`, { action: "update", queue });
  return res.status(201).json(queue);
};
export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;
  const { companyId } = req.user;
  await DeleteQueueService(queueId, companyId);
  const io = getIO();
  io.emit(`company-${companyId}-queue`, {
    action: "delete",
    queueId: +queueId
  });
  return res.status(200).send();
};
