import farawin from "farawin";
import Input from "postcss/lib/input";
import { useEffect, useState } from "react";
import "./App.css";
import Refresh from "./assets/refresh-svgrepo-com.png";
import Popup from "./popup";
import SearchBar from "./searchbar";
import RecieverChatMassage from "./resieverchatMassage";
import { useRef } from "react";

export default function ChatPage(props) {
  const [filteredContacts, setFilteredContacts] = useState(null);
  const [buttonToggle, setButtonToggle] = useState(null);
  const [buttonToggle2, setButtonToggle2] = useState(null);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [addPhoneNumber, setAddphoneNumber] = useState("");
  const [deletePhoneNumber, setDeletePhoneNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(null);
  const [isValidName, setIsValidName] = useState(null);
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [controlChats, setControlChats] = useState(false);
  const [controlContact , setControl] = useState(false)
  const contactListController = useRef(null);

  console.log(filteredContacts)
  if (contactListController?.current) {
    clearInterval(contactListController.current);
}

contactListController.current = setInterval(()=>{
    if(buttonToggle==null){
        setControl(false);
    }else{
        setControl(true)
    }
},1000);


  useEffect(() => {
    let ignore = false;
    farawin.getContacts((res) => {
      if (!ignore) {
        setFilteredContacts(
          res.contactList.filter(
            (contact) => contact.ref === localStorage.username
          )
        );
      }
    });

    return () => {
      ignore = true;
    };
  }, [buttonToggle]);

  console.log(selectedNumber)

  const handleRefreshChat = () => {
    setButtonToggle2(Math.random());
    setControlChats(true);
  };
  const handleRefresh = () => {
    console.log(filteredContacts);
    setButtonToggle(Math.random());
  };

  const handleAddContact = () => {
    setIsOpenAdd(!isOpenAdd);
  };
  const handleDeleteContact = () => {
    setIsOpenDelete(!isOpenDelete);
  };
  const handleAddPhoneChange = (event) => {
    var addPhoneNumber = event.target.value;
    const mobileRegex = farawin.mobileRegex;
    addPhoneNumber = farawin.toEnDigit(addPhoneNumber);
    if (addPhoneNumber === "") {
      setAddphoneNumber("");
      setIsValidPhone(null);
    } else if (mobileRegex.test(addPhoneNumber)) {
      setAddphoneNumber(addPhoneNumber);
      setIsValidPhone(true);
    } else {
      setAddphoneNumber(addPhoneNumber);
      setIsValidPhone(false);
    }
  };
  const handleDeleteChange = (event) => {
    var deletePhoneNumber = event.target.value;
    const mobileRegex = farawin.mobileRegex;
    deletePhoneNumber = farawin.toEnDigit(deletePhoneNumber);
    if (deletePhoneNumber === "") {
      setDeletePhoneNumber("");
      setIsValidPhone(null);
    } else if (mobileRegex.test(deletePhoneNumber)) {
      setDeletePhoneNumber(deletePhoneNumber);
      setIsValidPhone(true);
    } else {
      setDeletePhoneNumber(deletePhoneNumber);
      setIsValidPhone(false);
    }
  };
  const handleAddNameChange = (event) => {
    const contactName = event.target.value;
    const regex = /^.{3,}$/;
    if (contactName === "") {
      setContactName("");
      setIsValidName(null);
    } else if (regex.test(contactName)) {
      setContactName(contactName);
      setIsValidName(true);
    } else {
      setContactName(contactName);
      setIsValidName(false);
    }
  };
  const handleAddMembers = async () => {
    const phoneSend = addPhoneNumber;
    const nameSend = contactName;
    const resultAdd = await farawin.testAddContact(phoneSend, nameSend);
    if (resultAdd.code !== 200) {
      alert(resultAdd.message);
    } else {
      alert(resultAdd.message);
    }
  };
  const handleDeleteMembers = async () => {
    const deletePhoneSend = deletePhoneNumber;
    const resultDelete = await farawin.testDeleteContact(deletePhoneSend);
    if (resultDelete.code !== 200) {
      alert(resultDelete.message);
    } else {
      alert(resultDelete.message);
    }
  };
  const isSabtDisabled = !isValidPhone || !isValidName;
  const isHazfDisabled = !isValidPhone;
  const handleShowMenu = () => {
    const contactMenu = document.getElementById("Contact-menu");
    const chatContainer = document.getElementById("chat-container");
    const closeContactMenu = document.getElementById("close-contact-menu");

    contactMenu.style.display = "block";
    contactMenu.style.zIndex = "2";
    contactMenu.style.position = "absolute";
    contactMenu.style.top = "0";
    contactMenu.style.right = "0";
    contactMenu.style.bottom = "0";

    chatContainer.style.position = "absolute";
    chatContainer.style.top = "0";
    chatContainer.style.right = "0";
    chatContainer.style.left = "0";
    chatContainer.style.bottom = "0";

    closeContactMenu.style.display = "block";
    closeContactMenu.style.position = "absolute";
    contactMenu.style.top = "0";
    contactMenu.style.right = "0";
  };
  const handleCloseMenu = () => {
    const contactMenu = document.getElementById("Contact-menu");
    const closeContactMenu = document.getElementById("close-contact-menu");

    contactMenu.style.display = "none";
    closeContactMenu.style.display = "none";
  };

  return (
    <div dir="rtl" lang="fa">
      {isOpenDelete && (
        <Popup
          content={
            <>
              <button
                className="p-2 hover:bg-red-400 hover:text-white text-lg font-bold mt-1"
                onClick={handleDeleteContact}
              >
                بستن
              </button>
              <div className="flex flex-col items-start px-5 py-5">
                <label className="w-fit" htmlFor="">
                  شماره تلفن :
                </label>
                <input
                  onChange={handleDeleteChange}
                  value={deletePhoneNumber}
                  type="text"
                  className="outline-none border-b-2 w-full border-slate-300 p-2"
                />
                {isValidPhone === null ? null : isValidPhone ? (
                  //  تگ پی یک تگ پاراگراف و مخصوص نمایش متن است
                  <p className="text-green-500 text-xs">شماره تلفن درست است</p>
                ) : (
                  <p className="text-xs text-red-500">
                    شماره تلفن غلط است باید با 09 آغاز و دارای 11 رقم باشد.
                  </p>
                )}
              </div>
              <button
                disabled={isHazfDisabled}
                onClick={handleDeleteMembers}
                className="cursor-pointer p-2 hover:bg-green-400  hover:text-white text-lg font-bold mb-2 mt-3 w-11/12"
              >
                حذف مخاطب
              </button>
            </>
          }
        />
      )}
      {isOpenAdd && (
        <Popup
          content={
            <>
              <button
                className="p-2 hover:bg-red-400 hover:text-white text-lg font-bold mt-1"
                onClick={handleAddContact}
              >
                بستن
              </button>
              <div className="flex flex-col items-start px-5 py-5 ">
                <label className="w-fit" htmlFor="">
                  شماره تلفن :
                </label>
                <input
                  onChange={handleAddPhoneChange}
                  value={addPhoneNumber}
                  type="text"
                  className="outline-none border-b-2 w-full border-slate-300 p-2"
                />
                {isValidPhone === null ? null : isValidPhone ? (
                  //  تگ پی یک تگ پاراگراف و مخصوص نمایش متن است
                  <p className="text-green-500 text-xs">شماره تلفن درست است</p>
                ) : (
                  <p className="text-xs text-red-500">
                    شماره تلفن غلط است باید با 09 آغاز و دارای 11 رقم باشد.
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start px-5 py-5 ">
                <label className="w-fit" htmlFor="">
                  {" "}
                  اسم مخاطب :
                </label>
                <input
                  value={contactName}
                  onChange={handleAddNameChange}
                  type="text"
                  className="outline-none border-b-2 w-full border-slate-300 p-2"
                />
                {isValidName === null ? null : isValidName ? (
                  //  تگ پی یک تگ پاراگراف و مخصوص نمایش متن است
                  <p className="text-green-500 text-xs">درست وارد شده است</p>
                ) : (
                  <p className="text-xs text-red-500">
                    اسم باید بیشتر از 3 حرف داشته باشد.
                  </p>
                )}
              </div>
              <button
                disabled={isSabtDisabled}
                onClick={handleAddMembers}
                className="cursor-pointer p-2 hover:bg-green-400  hover:text-white text-lg font-bold mb-2 w-11/12"
              >
                ثبت
              </button>
            </>
          }
        />
      )}

      <div className="bg-[#34393C]">
        <section
          className="h-screen flex align-middle justify-center w-screen"
          id="Container"
        >
          <div
            id="Contact-menu"
            className="h-screen bg-[#202329] rounded-r-2xl lg:block min-[425px]:hidden min-[375px]:hidden min-[320px]:hidden p-2"
          >
            <div className="flex justify-center items-baseline w-full">
              <button
                id="close-contact-menu"
                onClick={handleCloseMenu}
                className="hidden hover:bg-blue-400 rounded-lg w-fit relative top-9 right-5"
              >
                <svg
                  className="fill-black"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                >
                  {" "}
                  <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                </svg>
              </button>
              <button
                id="refresh-contact"
                onClick={handleRefresh}
                className=" hover:bg-blue-400 w-fit rounded-lg p-1 relative top-7 left-4 "
              >
                <img className="w-[22px] h-[22px]" src={Refresh} alt="" />
              </button>
              <button
                onClick={handleAddContact}
                className="hover:bg-blue-400 w-fit rounded-lg p-1 relative top-6 left-3"
              >
                Add
              </button>
              <button
                onClick={handleDeleteContact}
                className="hover:bg-blue-400 w-fit rounded-lg p-1 relative top-6 left-2"
              >
                Delete
              </button>
            </div>

            <div id="search-bar" className="flex pt-11 mb-5 pl-2">
              <SearchBar data={filteredContacts} set={setSelectedContact} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="w-10 bg-[#2E333D] fill-slate-500 rounded-l-lg cursor-pointer"
              >
                <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
              </svg>
            </div>
            
            <div className="overflow-scroll overflow-x-hidden h-[70%]">
              {!controlContact ? (<p className="text-white font bold">مخاطبی وجود ندارد</p>) : (
                <div>
                  {buttonToggle &&
                filteredContacts &&
                filteredContacts.map((contact) => (
                  <div
                    key={contact.username}
                    id="selected-name"
                    className="cursor-pointer hover:bg-[#2E333D]"
                    onClick={() => {setSelectedContact(contact.name) , setSelectedNumber(contact.username)}}
                  >
                    <div className="flex items-center ">
                      <div className="w-12 h-12 bg-violet-500 flex items-center justify-center font-bold rounded-lg ">
                        {" "}
                        {contact.name.slice(0, 2)}{" "}
                      </div>
                      <div className="flex p-3 flex-col items-start ">
                        <h4 className="text-[18px] font-bold text-white">
                          {contact.name}
                        </h4>
                        <p className="text-slate-400">{contact.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
          <div
            id="chat-container"
            className="bg-[#202329] h-screen lg:w-5/12 flex flex-col items-start lg:rounded-l-2xl md:w-screen min-[425px]:w-screen min-[375px]:w-screen min-[320px]:w-screen max-md:rounded-lg max-[425px]:rounded-lg max-[375px]:rounded-lg max-[320px]:rounded-lg"
          >
            <div
              id="chat-header"
              className="w-11/12 flex justify-between align-middle p-4 mt-5 mx-auto rounded-lg h-fit"
            >
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleShowMenu}
                  className=" p-2 hover:bg-blue-400 rounded-2xl lg:hidden"
                >
                  <svg
                    className="fill-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z" />
                    <path d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z" />
                    <path d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z" />
                  </svg>
                </button>
                <button
                  onClick={handleRefreshChat}
                  className=" p-2 hover:bg-blue-400 rounded-2xl"
                >
                  Refresh Chat
                </button>
                <h1
                  id="chat-header-title"
                  className="font-bold text-lg bg-white text-black rounded-full p-2 pr-2"
                >
                  {selectedContact}
                </h1>
              </div>
            </div>
            <div
              id="chat-body"
              className="flex justify-center flex-col mx-auto p-5 h-3/4 w-full overflow-scroll overflow-x-hidden"
            >
              <div dir="rtl" className="p-2 mr-5 h-full w-full">
                {controlChats && (
                  <div className="p-2">
                    <RecieverChatMassage number={selectedNumber} />
                  </div>
                )}
              </div>
            </div>
            <div id="chat-sender" className="w-full p-3 flex justify-center">
              <input
                type="text"
                placeholder="پیغام خود را بنویسید ... "
                className="w-11/12 p-2 text-white outline-none rounded-lg border-none bg-[#2E333D]"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
