// import p_img1 from './p_img1.png'
// import p_img2_1 from './p_img2_1.png'
// import p_img2_2 from './p_img2_2.png'
// import p_img2_3 from './p_img2_3.png'
// import p_img2_4 from './p_img2_4.png'
// import no_image from './no_image.png'
// Using base64 encoded image directly to avoid file dependency
const no_image = "data:image/png;base64,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"
import p_img3 from './p_img3.png'
// import p_img4 from './p_img4.png'
// import p_img5 from './p_img5.png'
// import p_img6 from './p_img6.png'
// import p_img7 from './p_img7.png'
// import p_img8 from './p_img8.png'
// import p_img9 from './p_img9.png'
// import p_img10 from './p_img10.png'
// import p_img11 from './p_img11.png'
// import p_img12 from './p_img12.png'
// import p_img13 from './p_img13.png'
// import p_img14 from './p_img14.png'
// import p_img15 from './p_img15.png'
// import p_img16 from './p_img16.png'
// import p_img17 from './p_img17.png'
import p_img18 from './p_img18.png'
// import p_img19 from './p_img19.png'
// import p_img20 from './p_img20.png'
// import p_img21 from './p_img21.png'
// import p_img22 from './p_img22.png'
// import p_img23 from './p_img23.png'
// import p_img24 from './p_img24.png'
// import p_img25 from './p_img25.png'
// import p_img26 from './p_img26.png'
// import p_img27 from './p_img27.png'
// import p_img28 from './p_img28.png'
// import p_img29 from './p_img29.png'
// import p_img30 from './p_img30.png'
import p_img31 from './p_img31.png'
// import p_img32 from './p_img32.png'
// import p_img33 from './p_img33.png'
// import p_img34 from './p_img34.png'
// import p_img35 from './p_img35.png'
// import p_img36 from './p_img36.png'
// import p_img37 from './p_img37.png'
// import p_img38 from './p_img38.png'
// import p_img39 from './p_img39.png'
// import p_img40 from './p_img40.png'
// import p_img41 from './p_img41.png'
// import p_img42 from './p_img42.png'
// import p_img43 from './p_img43.png'
// import p_img44 from './p_img44.png'
// import p_img45 from './p_img45.png'
// import p_img46 from './p_img46.png'
// import p_img47 from './p_img47.png'
// import p_img48 from './p_img48.png'
// import p_img49 from './p_img49.png'
// import p_img50 from './p_img50.png'
// import p_img51 from './p_img51.png'
// import p_img52 from './p_img52.png'
import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import NO_IMAGE_FILE from './no_image.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon,
    no_image: NO_IMAGE_FILE
    ,
    // Category visuals used on Home page
    p_img3,
    p_img18,
    p_img31
}

// export const products = [
//     {
//         _id: "aaaaa",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 100,
//         image: [p_img1,p_img2_2,p_img2_3,p_img2_4],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L"],
//         date: 1716634345448,
//         bestseller: true
//     },
//     {
//         _id: "aaaab",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 200,
//         image: [p_img2_1,p_img2_2,p_img2_3,p_img2_4],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["M", "L", "XL"],
//         date: 1716621345448,
//         bestseller: true
//     },
//     {
//         _id: "aaaac",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 220,
//         image: [p_img3],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "L", "XL"],
//         date: 1716234545448,
//         bestseller: true
//     },
//     {
//         _id: "aaaad",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 110,
//         image: [p_img4],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "XXL"],
//         date: 1716621345448,
//         bestseller: true
//     },
//     {
//         _id: "aaaae",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 130,
//         image: [p_img5],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["M", "L", "XL"],
//         date: 1716622345448,
//         bestseller: true
//     },
//     {
//         _id: "aaaaf",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 140,
//         image: [p_img6],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "L", "XL"],
//         date: 1716623423448,
//         bestseller: true
//     },
//     {
//         _id: "aaaag",
//         name: "Men Tapered Fit Flat-Front Trousers",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 190,
//         image: [p_img7],
//         category: "Men",
//         subCategory: "Bottomwear",
//         sizes: ["S", "L", "XL"],
//         date: 1716621542448,
//         bestseller: false
//     },
//     {
//         _id: "aaaah",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 140,
//         image: [p_img8],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716622345448,
//         bestseller: false
//     },
//     {
//         _id: "aaaai",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 100,
//         image: [p_img9],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["M", "L", "XL"],
//         date: 1716621235448,
//         bestseller: false
//     },
//     {
//         _id: "aaaaj",
//         name: "Men Tapered Fit Flat-Front Trousers",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 110,
//         image: [p_img10],
//         category: "Men",
//         subCategory: "Bottomwear",
//         sizes: ["S", "L", "XL"],
//         date: 1716622235448,
//         bestseller: false
//     },
//     {
//         _id: "aaaak",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 120,
//         image: [p_img11],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L"],
//         date: 1716623345448,
//         bestseller: false
//     },
//     {
//         _id: "aaaal",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 150,
//         image: [p_img12],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716624445448,
//         bestseller: false
//     },
//     {
//         _id: "aaaam",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 130,
//         image: [p_img13],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716625545448,
//         bestseller: false
//     },
//     {
//         _id: "aaaan",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 160,
//         image: [p_img14],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716626645448,
//         bestseller: false
//     },
//     {
//         _id: "aaaao",
//         name: "Men Tapered Fit Flat-Front Trousers",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 140,
//         image: [p_img15],
//         category: "Men",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716627745448,
//         bestseller: false
//     },
//     {
//         _id: "aaaap",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 170,
//         image: [p_img16],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716628845448,
//         bestseller: false
//     },
//     {
//         _id: "aaaaq",
//         name: "Men Tapered Fit Flat-Front Trousers",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 150,
//         image: [p_img17],
//         category: "Men",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716629945448,
//         bestseller: false
//     },
//     {
//         _id: "aaaar",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 180,
//         image: [p_img18],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716631045448,
//         bestseller: false
//     },
//     {
//         _id: "aaaas",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 160,
//         image: [p_img19],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716632145448,
//         bestseller: false
//     },
//     {
//         _id: "aaaat",
//         name: "Women Palazzo Pants with Waist Belt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 190,
//         image: [p_img20],
//         category: "Women",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716633245448,
//         bestseller: false
//     },
//     {
//         _id: "aaaau",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 170,
//         image: [p_img21],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716634345448,
//         bestseller: false
//     },
//     {
//         _id: "aaaav",
//         name: "Women Palazzo Pants with Waist Belt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 200,
//         image: [p_img22],
//         category: "Women",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716635445448,
//         bestseller: false
//     },
//     {
//         _id: "aaaaw",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 180,
//         image: [p_img23],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716636545448,
//         bestseller: false
//     },
//     {
//         _id: "aaaax",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 210,
//         image: [p_img24],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716637645448,
//         bestseller: false
//     },
//     {
//         _id: "aaaay",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 190,
//         image: [p_img25],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716638745448,
//         bestseller: false
//     },
//     {
//         _id: "aaaaz",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 220,
//         image: [p_img26],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716639845448,
//         bestseller: false
//     },
//     {
//         _id: "aaaba",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 200,
//         image: [p_img27],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716640945448,
//         bestseller: false
//     },
//     {
//         _id: "aaabb",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 230,
//         image: [p_img28],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716642045448,
//         bestseller: false
//     },
//     {
//         _id: "aaabc",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 210,
//         image: [p_img29],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716643145448,
//         bestseller: false
//     },
//     {
//         _id: "aaabd",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 240,
//         image: [p_img30],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716644245448,
//         bestseller: false
//     },
//     {
//         _id: "aaabe",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 220,
//         image: [p_img31],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716645345448,
//         bestseller: false
//     },
//     {
//         _id: "aaabf",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 250,
//         image: [p_img32],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716646445448,
//         bestseller: false
//     },
//     {
//         _id: "aaabg",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 230,
//         image: [p_img33],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716647545448,
//         bestseller: false
//     },
//     {
//         _id: "aaabh",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 260,
//         image: [p_img34],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716648645448,
//         bestseller: false
//     },
//     {
//         _id: "aaabi",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 240,
//         image: [p_img35],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716649745448,
//         bestseller: false
//     },
//     {
//         _id: "aaabj",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 270,
//         image: [p_img36],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716650845448,
//         bestseller: false
//     },
//     {
//         _id: "aaabk",
//         name: "Women Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 250,
//         image: [p_img37],
//         category: "Women",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716651945448,
//         bestseller: false
//     },
//     {
//         _id: "aaabl",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 280,
//         image: [p_img38],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716653045448,
//         bestseller: false
//     },
//     {
//         _id: "aaabm",
//         name: "Men Printed Plain Cotton Shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 260,
//         image: [p_img39],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716654145448,
//         bestseller: false
//     },
//     {
//         _id: "aaabn",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 290,
//         image: [p_img40],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716655245448,
//         bestseller: false
//     },
//     {
//         _id: "aaabo",
//         name: "Men Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 270,
//         image: [p_img41],
//         category: "Men",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716656345448,
//         bestseller: false
//     },
//     {
//         _id: "aaabp",
//         name: "Boy Round Neck Pure Cotton T-shirt",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 300,
//         image: [p_img42],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716657445448,
//         bestseller: false
//     },
//     {
//         _id: "aaabq",
//         name: "Kid Tapered Slim Fit Trouser",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 280,
//         image: [p_img43],
//         category: "Kids",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716658545448,
//         bestseller: false
//     },
//     {
//         _id: "aaabr",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 310,
//         image: [p_img44],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716659645448,
//         bestseller: false
//     },
//     {
//         _id: "aaabs",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 290,
//         image: [p_img45],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716660745448,
//         bestseller: false
//     },
//     {
//         _id: "aaabt",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 320,
//         image: [p_img46],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716661845448,
//         bestseller: false
//     },
//     {
//         _id: "aaabu",
//         name: "Kid Tapered Slim Fit Trouser",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 300,
//         image: [p_img47],
//         category: "Kids",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716662945448,
//         bestseller: false
//     },
//     {
//         _id: "aaabv",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 330,
//         image: [p_img48],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716664045448,
//         bestseller: false
//     },
//     {
//         _id: "aaabw",
//         name: "Kid Tapered Slim Fit Trouser",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 310,
//         image: [p_img49],
//         category: "Kids",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716665145448,
//         bestseller: false
//     },
//     {
//         _id: "aaabx",
//         name: "Kid Tapered Slim Fit Trouser",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 340,
//         image: [p_img50],
//         category: "Kids",
//         subCategory: "Bottomwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716666245448, bestseller: false
//     },
//     {
//         _id: "aaaby",
//         name: "Women Zip-Front Relaxed Fit Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 320,
//         image: [p_img51],
//         category: "Women",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716667345448,
//         bestseller: false
//     },
//     {
//         _id: "aaabz",
//         name: "Men Slim Fit Relaxed Denim Jacket",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 350,
//         image: [p_img52],
//         category: "Men",
//         subCategory: "Winterwear",
//         sizes: ["S", "M", "L", "XL"],
//         date: 1716668445448,
//         bestseller: false
//     }

// ]