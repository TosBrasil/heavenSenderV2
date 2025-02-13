import React, { useState, useContext, useRef } from "react";

import MenuItem from "@material-ui/core/MenuItem";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ConfirmationModal from "../ConfirmationModal";
import { Menu } from "@material-ui/core";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import toastError from "../../errors/toastError";
import ForwardMessageModal from "../ForwardMessageModal";
import EditMessageModal from "../EditMessageModal";


const MessageOptionsMenu = ({ message, menuOpen, handleClose, anchorEl }) => {
	const { setReplyingMessage } = useContext(ReplyMessageContext);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [forwardMessageModalOpen, setForwardMessageModalOpen] = useState(false);
	const [messageEdit, setMessageEdit] = useState(false);
	const [confirmationEditOpen, setEditMessageOpenModal] = useState(false);
	// const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	// const [selectedSchedule, setSelectedSchedule] = useState(null);
	const isMounted = useRef(true);

	const handleForwardMessage = () => {
		setForwardMessageModalOpen(true)
		handleClose();
	};

	// const handleForwardMessage = () => {
	// 	//setSelectedSchedule(schedule);
	// 	handleClose();
	// 	setScheduleModalOpen(true);
	// };

	// const handleCloseScheduleModal = () => {
	// 	setSelectedSchedule(null);
	// 	setScheduleModalOpen(false);
	// 	handleClose();
	// };

	const handleCloseForwardMessageModal = () => {
		if (isMounted.current) {
			setForwardMessageModalOpen(false);
		}
	};

	const handleDeleteMessage = async () => {
		try {
			await api.delete(`/messages/${message.id}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleEditMessage = async () => {
		try {
			await api.put(`/messages/${message.id}`);
		} catch (err) {
			toastError(err);
		}
	}

	const hanldeReplyMessage = () => {
		setReplyingMessage(message);
		handleClose();
	};

	const handleOpenConfirmationModal = e => {
		setConfirmationOpen(true);
		handleClose();
	};

	const handleOpenEditMessageModal = e => {
		setEditMessageOpenModal(true);
		setMessageEdit(message)
		handleClose();
	};


	return (
		<>
			<ConfirmationModal
				title={i18n.t("messageOptionsMenu.confirmationModal.title")}
				open={confirmationOpen}
				onClose={setConfirmationOpen}
				onConfirm={handleDeleteMessage}
			>
				{i18n.t("messageOptionsMenu.confirmationModal.message")}
			</ConfirmationModal>
			<EditMessageModal
				title={i18n.t("messageOptionsMenu.editMessageModal.title")}
				open={confirmationEditOpen}
				onClose={setEditMessageOpenModal}
				onSave={handleEditMessage}
				message={message}
			>
				{i18n.t("messageOptionsMenu.confirmationModal.message")}
			</EditMessageModal>
			{/* <ForwardModal
				open={scheduleModalOpen}
				onClose={handleCloseScheduleModal}
				message={message}
			/> */}
			<Menu
				anchorEl={anchorEl}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={menuOpen}
				onClose={handleClose}
			>
				{message.fromMe && (
					<MenuItem onClick={handleOpenEditMessageModal}>
						{i18n.t("messageOptionsMenu.edit")}
					</MenuItem>
				)}			
				{message.fromMe && (
					<MenuItem onClick={handleOpenConfirmationModal}>
						{i18n.t("messageOptionsMenu.delete")}
					</MenuItem>
				)}
				<MenuItem onClick={hanldeReplyMessage}>
					{i18n.t("messageOptionsMenu.reply")}
				</MenuItem>

				<MenuItem onClick={() => handleForwardMessage()}>
					{i18n.t("messageOptionsMenu.toForward")}
				</MenuItem>
				{/* <MenuItem onClick={() => handleForwardMessage(message)}>
					{i18n.t("messageOptionsMenu.toForward")}
				</MenuItem> */}

			</Menu>
			<ForwardMessageModal
				modalOpen={forwardMessageModalOpen}
				onClose={handleCloseForwardMessageModal}
				message={message}
			/>
		</>
	);
};

export default MessageOptionsMenu;
