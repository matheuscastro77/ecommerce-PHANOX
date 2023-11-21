import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }

        // const storedData = localStorage.getItem('cartItems');

        // // Verifique se os dados existem e são um array
        // if (storedData) {
        //     try {
        //         const parsedData = JSON.parse(storedData);

        //         console.log(parsedData[0].quantity);

        //         // Verifique se os dados são um array
        //         if (Array.isArray(parsedData)) {
        //             const numberOfItems = parsedData.length;
        //             console.log(`Número de itens no array: ${numberOfItems}`);
        //         } else {
        //             console.log('Os dados armazenados não são um array.');
        //         }
        //     } catch (error) {
        //         console.error('Erro ao analisar os dados do localStorage:', error);
        //     }
        // } else {
        //     console.log('Não há dados armazenados para essa chave.');
        // }
    }, []);


    // const updateCartItemsAndLocalStorage = (updatedCartItems) => {
    //     setCartItems(updatedCartItems);
    //     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    // };


    const onAdd = (product, quantity) => {
        if (!product || !product._id) {
            return;
        }

        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                };
                return cartProduct; // Adicionei essa linha para retornar o produto sem modificação
            });

            setCartItems(updatedCartItems);

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
            // product.quantity = quantity;
            // setCartItems([...cartItems, { ...product }]);
            // localStorage.setItem('cartItems', JSON.stringify([...cartItems, { ...product }]));

            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
            // updateCartItemsAndLocalStorage(cartItems);

            localStorage.setItem('cartItems', JSON.stringify([...cartItems, { ...product }]));

        }

        // updateCartItemsAndLocalStorage(cartItems);



        toast.success(`${quantity} ${product.name} adicionado ao carrinho.`);
    }

    const onRemove = (product) => {
        if (!product || !product._id) {
            console.error("Produto inválido ou sem ID");
            return;
        }

        const foundProduct = cartItems.find((item) => item._id === product._id);
        if (!foundProduct) {
            console.error("Produto não encontrado no carrinho");
            return;
        }

        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);

        localStorage.setItem('cartItems', JSON.stringify(newCartItems));

        toast.success(`${foundProduct.name} removido do carrinho.`);
    }

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);

        if (value === 'inc') {
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
            setCartItems(prevCartItems =>
                prevCartItems.map(item => {
                    if (item._id === id) {
                        return { ...item, quantity: foundProduct.quantity + 1 }
                    }
                    return item
                })
            );
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
                setCartItems(prevCartItems =>
                    prevCartItems.map(item => {
                        if (item._id === id) {
                            return { ...item, quantity: foundProduct.quantity - 1 }
                        }
                        return item
                    })
                );
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuanitity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);


// const onAdd = (product, quantity) => {
//     const checkProductInCart = cartItems.find((item) => item._id === product._id);

//     setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
//     setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

//     if (checkProductInCart) {
//         const updatedCartItems = cartItems.map((cartProduct) => {
//             if (cartProduct._id === product._id) return {
//                 ...cartProduct,
//                 quantity: cartProduct.quantity + quantity
//             }
//         })

//         setCartItems(updatedCartItems);
//     } else {
//         product.quantity = quantity;

//         setCartItems([...cartItems, { ...product }]);
//     }

//     toast.success(`${qty} ${product.name} adicionado ao carrinho.`);
// }

// const onRemove = (product) => {
//     foundProduct = cartItems.find((item) => item._id === product._id);
//     const newCartItems = cartItems.filter((item) => item._id !== product._id);

//     setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
//     setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
//     setCartItems(newCartItems);
// }
