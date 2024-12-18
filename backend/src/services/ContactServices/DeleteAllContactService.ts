import Contact from "../../models/Contact";
import AppError from "../../errors/AppError";

const DeleteAllContactService = async (companyId: number): Promise<void> => {
  await Contact.findAll({ where: {companyId}});

  if (!Contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  await Contact.destroy({where: {companyId} })
};

export default DeleteAllContactService;