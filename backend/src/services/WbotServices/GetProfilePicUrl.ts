import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
const GetProfilePicUrl = async (
  number: string,
  companyId: number
): Promise<string> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(companyId);
  const wbot = getWbot(defaultWhatsapp.id);
  let profilePicUrl: string;
  try {
    profilePicUrl = await wbot.profilePictureUrl(`${number}@s.whatsapp.net`);
  } catch (error) {
    // profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
    profilePicUrl = `https://cdn-icons-png.flaticon.com/512/3607/3607444.png`
  }
  return profilePicUrl;
};
export default GetProfilePicUrl;
