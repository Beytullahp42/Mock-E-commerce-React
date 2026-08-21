import React, {useState} from "react";
import {createOrder} from "../services/OrderService.ts";
import {toast} from "react-toastify";
import {useAuth} from "../context/auth-context.ts";

interface CheckoutModalProps {
    isOpen: boolean;
    closeModal: () => void;
    refreshCart: () => void;
}

function CheckoutModal({isOpen, closeModal, refreshCart}: CheckoutModalProps) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const {account} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const orderDto = {
            name,
            surname,
            phoneNumber,
            address
        };
        await toast.promise(
            createOrder(orderDto),
            {
                pending: "Placing your order...",
                success: "Order placed successfully!",
                error: "Failed to place the order"
            }
        );
        refreshCart();
        closeModal();
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setSurname('');
        setPhoneNumber('');
        setAddress('');

        setCardHolder('');
        setCardNumber('');
        setExpirationDate('');
        setCvv('');
    };

    if (!isOpen) {
        return null
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={closeModal}
            ></div>

            <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto mx-3">
                    <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                            required
                        />
                        <input type="email" value={account?.email ?? ""} readOnly aria-label="Account email"/>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                        />

                        <hr className="my-2"/>

                        <h3 className="text-lg font-semibold">Payment Information</h3>
                        <p className="text-sm bg-amber-100 border border-amber-400 rounded p-2">
                            Demo only: use fake card details. These values never leave your browser and are not stored or processed.
                        </p>

                        <input
                            type="text"
                            placeholder="Cardholder's Name"
                            value={cardHolder}
                            onChange={e => setCardHolder(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            required
                            inputMode="numeric"
                        />
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <input
                                type="tel"
                                placeholder="MM/YY"
                                value={expirationDate}
                                onChange={e => setExpirationDate(e.target.value)}
                                required
                                maxLength={5}
                                className="w-full sm:w-1/2"
                            />
                            <input
                                type="tel"
                                placeholder="CVV"
                                value={cvv}
                                onChange={e => setCvv(e.target.value)}
                                required
                                inputMode="numeric"
                                maxLength={3}
                                className="w-full sm:w-1/2"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CheckoutModal;
