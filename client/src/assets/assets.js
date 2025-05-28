import avatar_icon from './avatar_icon.png'
import gallery_icon from './gallery_icon.png'
import help_icon from './help_icon.png'
import logo_icon from './logo_icon.png'
import logo_big from './logo_big.png'
import logo from './logo.png'
import pic1 from './pic1.png'
import pic2 from './pic2.png'
import pic3 from './pic3.png'
import pic4 from './pic4.png'
import profile_richard from './profile_richard.png'
import profile_alison from './profile_alison.png'
import profile_enrique from './profile_enrique.png'
import profile_marco from './profile_marco.png'
import profile_martin from './profile_martin.png'
import search_icon from './search_icon.png'
import send_button from './send_button.png'
import add_icon from './add_icon.png'
import menu_icon from './menu_icon.png'
import menu_icon_big from './menu_icon_big.svg'
import arrow_icon from './arrow_icon.png'
import green_dot from './green_dot.png'
import robot from './robot.gif'
import img1 from './img1.jpg'
import img2 from './img2.jpg'
import saarthi from './saarthi.png'
import history_icon from './history_icon.png'
import plus_icon from './plus_icon.png'
import question_icon from './question_icon.png'
import setting_icon from './setting_icon.png'
import bulb_icon from './bulb_icon.png'
import compass_icon from './compass_icon.png'
import mic_icon from './mic_icon.png'
import message_icon from './message_icon.png'
import code_icon from './code_icon.png'
import pencil_icon from './pencil_icon.svg'
import sidebar_close from './sidebar_close_icon.svg'
import sidebar_open from './sidebar_icon.svg'
import chat_icon from './chat_icon.svg'
import logout from './logout.png'
import pin_icon from './pin_icon.svg'
import deepthink_icon from './deepthink_icon.svg'
import search from './search_icon.svg'
import arrow from './arrow_icon_dull.svg'
import three_dots from './three_dots.svg'
import delete_icon from './delete_icon.svg'
import copy_icon from './copy_icon.svg'
import like from './like_icon.svg'
import dislike from './dislike_icon.svg'
import regenerate from './regenerate_icon.svg'



const assets = {
    avatar_icon,
    gallery_icon,
    help_icon,
    logo_big,
    logo_icon,
    logo,
    pic1,
    pic2,
    pic3,
    pic4,
    img1,
    img2,
    profile_richard ,
    profile_alison,
    profile_enrique,
    profile_marco,
    profile_martin,
    search_icon,
    send_button,
    add_icon,
    menu_icon,
    arrow_icon,
    green_dot,
    robot,
    saarthi,
    history_icon,
    plus_icon,
    question_icon,
    setting_icon,
    bulb_icon,
    compass_icon,
    mic_icon,
    message_icon,
    code_icon,
    pencil_icon,
    sidebar_close,
    sidebar_open,
    chat_icon,
    menu_icon_big,
    logout,
    pin_icon,
    deepthink_icon,
    search,
    arrow,
    three_dots,
    delete_icon,copy_icon,
    like,dislike,regenerate
}

export default assets;

export const imagesDummyData = [pic1, pic2, pic3, pic4,img1,img2]

export const userDummyData = [
    {
        "_id": "680f50aaf10f3cd28382ecf2",
        "email": "test1@greatstack.dev",
        "fullName": "Alison Martin",
        "profilePic": profile_alison,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
    {
        "_id": "680f50e4f10f3cd28382ecf9",
        "email": "test2@greatstack.dev",
        "fullName": "Martin Johnson",
        "profilePic": profile_martin,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
    {
        "_id": "680f510af10f3cd28382ed01",
        "email": "test3@greatstack.dev",
        "fullName": "Enrique Martinez",
        "profilePic": profile_enrique,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
    {
        "_id": "680f5137f10f3cd28382ed10",
        "email": "test4@greatstack.dev",
        "fullName": "Marco Jones",
        "profilePic": profile_marco,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
    {
        "_id": "680f516cf10f3cd28382ed11",
        "email": "test5@greatstack.dev",
        "fullName": "Richard Smith",
        "profilePic": profile_richard,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
     {
        "_id": "680f50aaf10f3cd28382ecf2",
        "email": "test1@greatstack.dev",
        "fullName": "Alison Martin",
        "profilePic": profile_alison,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
    {
        "_id": "680f50e4f10f3cd28382ecf9",
        "email": "test2@greatstack.dev",
        "fullName": "Martin Johnson",
        "profilePic": profile_martin,
        "bio": "Hi Everyone, I am Using ChitChat",
    },
]

export const messagesDummyData = [
    {
        "_id": "680f571ff10f3cd28382f094",
        "senderId": "680f5116f10f3cd28382ed02",
        "receiverId": "680f50e4f10f3cd28382ecf9",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "seen": true,
        "createdAt": "2025-04-28T10:23:27.844Z",
    },
    {
        "_id": "680f5726f10f3cd28382f0b1",
        "senderId": "680f50e4f10f3cd28382ecf9",
        "receiverId": "680f5116f10f3cd28382ed02",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "seen": true,
        "createdAt": "2025-04-28T10:23:34.520Z",
    },
    {
        "_id": "680f5729f10f3cd28382f0b6",
        "senderId": "680f5116f10f3cd28382ed02",
        "receiverId": "680f50e4f10f3cd28382ecf9",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "seen": true,
        "createdAt": "2025-04-28T10:23:37.301Z",
    },
    {
        "_id": "680f572cf10f3cd28382f0bb",
        "senderId": "680f50e4f10f3cd28382ecf9",
        "receiverId": "680f5116f10f3cd28382ed02",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "seen": true,
        "createdAt": "2025-04-28T10:23:40.334Z",
    },
    {
        "_id": "680f573cf10f3cd28382f0c0",
        "senderId": "680f50e4f10f3cd28382ecf9",
        "receiverId": "680f5116f10f3cd28382ed02",
        "image": pic1,
        "seen": true,
        "createdAt": "2025-04-28T10:23:56.265Z",
    },
    {
        "_id": "680f5745f10f3cd28382f0c5",
        "senderId": "680f5116f10f3cd28382ed02",
        "receiverId": "680f50e4f10f3cd28382ecf9",
        "image": pic2,
        "seen": true,
        "createdAt": "2025-04-28T10:24:05.164Z",
    },
    {
        "_id": "680f5748f10f3cd28382f0ca",
        "senderId": "680f5116f10f3cd28382ed02",
        "receiverId": "680f50e4f10f3cd28382ecf9",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "seen": true,
        "createdAt": "2025-04-28T10:24:08.523Z",
    }
]
