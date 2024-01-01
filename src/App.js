import './App.css';
import {useEffect, useState} from "react";
import Loader from "./componets/loader";
import {apiService} from './services'
import toast, {Toaster} from 'react-hot-toast';

function App() {
    const [loader, setLoader] = useState(false);
    const [cryptoCurrencyArray, setCryptoCurrencyArray] = useState([]);
    const [currencyArray, setCurrencyArray] = useState([]);
    const [result, setResult] = useState(0);
    const [inputs, setInputs] = useState({
        cryptoCurrency: "",
        amount: "",
        targetCurrency: "USD"
    });
    const [error, setError] = useState({
        cryptocurrencyErr: "",
        amountErr: "",
        targetCurrencyErr: ""
    })

    // call apis for get latest top 100 crypto currency and currencies on component render
    useEffect(() => {
        try {

            const getCryptoCurrency = async () => {
                const cryptoApiResponse = await apiService.callApi({
                    url: '/public/getAllCryptoCurrencyInfo'
                })
                if (cryptoApiResponse?.code === 200) {
                    console.log('====api response', cryptoApiResponse?.data.length)
                    setCryptoCurrencyArray(cryptoApiResponse?.data || []);
                }
            }

            const getCurrency = async () => {
                const currencyApiResponse = await apiService.callApi({
                    url: '/public/getCurrencies'
                })
                if (currencyApiResponse?.code === 200) {
                    console.log('====api response', currencyApiResponse?.data.length)
                    setCurrencyArray(currencyApiResponse?.data || [])
                }
            }

            getCryptoCurrency().catch(error => console.log('api error', error));
            getCurrency().catch(error => console.log('api error', error));
        } catch (e) {
            toast.error("Something went wrong! Please try again later.")
        }

    }, [])

    // set value on input state base on name
    const handleChange = (e) => {
        console.log(e.target)
        const name = e.target.name;
        const value = e.target.value;
        setInputs({...inputs, [name]: value});
        console.log(inputs);
    }

    // error handling function
    const validate = () => {
        const {cryptoCurrency, amount, targetCurrency} = inputs;
        let errorLog = {
            cryptocurrencyErr: "",
            amountErr: "",
            targetCurrencyErr: ""
        }

        !cryptoCurrency ? errorLog = {
            ...errorLog,
            cryptocurrencyErr: "Source cryptocurrency is Required*"
        } : errorLog = {...errorLog, emailErr: null};

        !amount ? errorLog = {
            ...errorLog,
            amountErr: "Amount is Required*"
        } : errorLog = {...errorLog, passwordErr: null};

        !targetCurrency ? errorLog = {
            ...errorLog,
            targetCurrencyErr: "Target currency is Required*"
        } : errorLog = {...errorLog, passwordErr: null};

        setError(errorLog);

        console.log('=====error', errorLog)
        return !Object.values(errorLog).find(x => x);
    }

    // call api for getting converted amount base on currency and cryptocurrency
    const getConvertedAmount = async (e) => {
        e.preventDefault();
        setResult(0)
        if (validate()) {
            setLoader(true);

            try {
                const body = {
                    "symbol": inputs?.cryptoCurrency,
                    "convert": inputs?.targetCurrency,
                    "rate": inputs?.amount
                }

                const getConvertedRate = await apiService.callApi({
                    url: '/public/getCurrencyConverterRate',
                    params: body
                });

                if (getConvertedRate?.code === 200) {
                    setResult((getConvertedRate?.data?.result).toFixed(2) || 0)
                }
            } catch (e) {
                toast.error("Something went wrong! Please try again later.")
            } finally {
                setLoader(false);
            }
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <Toaster position={'top-right'}/>
            <div className="row ">
                <div className="d-flex justify-content-center">
                    <div className="card">
                        <p className="px-2">Welcome to Cryptocurrency Convertor!</p>
                        <div className="card-body">
                            <form onSubmit={(event) => getConvertedAmount(event)}>

                                <div className="mb-3">
                                    <label htmlFor="cryptocurrency" className="form-label">Select a source
                                        cryptocurrency:</label>
                                    <select name='cryptoCurrency' className="form-select"
                                            aria-label="Default select example" onChange={handleChange}>
                                        <option selected value={''}>---</option>
                                        {cryptoCurrencyArray?.length !== 0 && cryptoCurrencyArray.map((data, key) => {
                                            return <option key={key} value={data.value}>{data.name}</option>
                                        })}
                                    </select>
                                    {error.cryptocurrencyErr &&
                                    <span className="error">{error.cryptocurrencyErr}</span>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label">Enter the amount:</label>
                                    <input name="amount" type="number" className="form-control" id="amount"
                                           onChange={handleChange}/>
                                    {error.amountErr && <span className="error">{error.amountErr}</span>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Select a target currency:</label>
                                    <select name="targetCurrency" className="form-select" value={inputs.targetCurrency}
                                            aria-label="Default select example" onChange={handleChange}>
                                        <option selected value={''}>---</option>
                                        {currencyArray?.length !== 0 && currencyArray.map((data, key) => {
                                            return <option key={key} value={data.value}>{data.name}</option>
                                        })}
                                    </select>
                                    {error.targetCurrencyErr &&
                                    <span className="error">{error.targetCurrencyErr}</span>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-check-label" htmlFor="result">Result:</label>
                                    <input type="number" className="form-control" id="result" disabled value={result}/>
                                </div>
                                <button type="submit" className="btn submit-button" disabled={loader}>Submit {loader &&
                                <Loader/>}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
