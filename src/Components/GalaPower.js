import {ethers} from "ethers";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as erc20Abi } from "@uniswap/v3-core/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json";
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Box, Grid, InputAdornment, Slider, TextField, Typography} from "@mui/material";
import {AccountBalanceWallet, OfflineBolt} from "@mui/icons-material";
import {makeStyles} from "@material-ui/styles";
import WalletConnect from "./WalletConnect";

const styles = makeStyles({
    root: {
        padding: 25,
        width: "100%",
        "& .MuiFormControl-root": {
            marginTop: 15
        },
        "& .MuiInputBase-root": {
            height: 50,
            paddingLeft: 10
        },
        "& .MuiGrid-item": {
            padding: "0 10px"
        }
    }
});

export default function GalaPower() {
    const classes = styles()

    const [accountValid, setAccountValid] = useState(true)
    const [address, setAddress] = useState("")
    const [addressUpdated, setAddressUpdated] = useState(true)
    const [amountIn, setAmountIn] = useState(0)
    const [quote, setQuote] = useState(0)
    const [ratio, setRatio] = useState(0)

    const poolAddress = "0x8452d58c1ec45016a668d1c8ab4179551abf7124";

    const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);

    const poolContract = useMemo(() => new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    ), [poolAddress, provider]);

    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

    const quoterContract = useMemo( () => new ethers.Contract(quoterAddress, QuoterABI, provider), [provider]);

    const getPoolImmutables = useCallback(async () => {
        interface Immutables {
            factory: string;
            token0: string;
            token1: string;
            fee: number;
            tickSpacing: number;
            maxLiquidityPerTick: ethers.BigNumber;
        }

        const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
            await Promise.all([
                poolContract.factory(),
                poolContract.token0(),
                poolContract.token1(),
                poolContract.fee(),
                poolContract.tickSpacing(),
                poolContract.maxLiquidityPerTick(),
            ]);

        const immutables: Immutables = {
            factory,
            token0,
            token1,
            fee,
            tickSpacing,
            maxLiquidityPerTick,
        };
        return immutables;
    }, [poolContract])

    const getQuote = useCallback(async () => {
        if (amountIn === 0) {
            return 0
        }

        const immutables = await getPoolImmutables()

        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
            immutables.token1,
            immutables.token0,
            immutables.fee,
            amountIn.toString(),
            0
        );

        return quotedAmountOut.toString()
    }, [amountIn, getPoolImmutables, quoterContract])

    const balance = useCallback(async (address, contractAddress) => {
        if (!(address.startsWith('0x') || address.endsWith('.eth'))) {
            return 0
        }

        if (contractAddress) {
            const contract = new ethers.Contract(contractAddress, erc20Abi, provider);

            const balance = await contract.balanceOf(address)
                .then((bal) => {
                    setAccountValid(true)

                    return bal
                })
                .catch((err) => {
                    console.log(err)

                    setAccountValid(false)

                    return 0
                })

            return balance.toString();
        }

        const balance = await provider.getBalance(address).catch((err) => console.log(err))
        return ethers.utils.formatEther(balance);
    }, [provider])

    useEffect(() => {
        async function setAmountInDebouncer() {
            const setAmountInDebounce = setTimeout(() => {
                if (amountIn > 0) {
                    getQuote(amountIn).then(quote => {
                        setQuote(quote)
                        setRatio(quote / amountIn)
                    })
                }
            }, 1000)

            return () => clearTimeout(setAmountInDebounce)
        }

        setAmountInDebouncer();
    }, [amountIn, getQuote])

    useEffect(() => {
        async function setAddressDebouncer() {
            const setAddressDebounce = setTimeout(async () => {
                if ((amountIn === 0 || addressUpdated) && (address.endsWith('.eth') || address.startsWith('0x'))) {
                    const bal =
                        await balance(address, await poolContract.token1())
                            .then(value => {
                                return value / Math.pow(10, 8)
                            })

                    setAmountIn(bal.toFixed(0))
                    setAddressUpdated(false)

                    if (bal.toFixed(0) < 1) {
                        setQuote(0)
                    }
                }
            }, 1000)

            return () => clearTimeout(setAddressDebounce)
        }

        setAddressDebouncer();
    }, [address, addressUpdated, amountIn, balance, poolContract])

    const [galaBalance, setGalaBalance] = useState(0)
    const [townBalance, setTownBalance] = useState(0)
    const [gpSplit, setGPSplit] = useState(0)

    useEffect(() => {
        async function getGalaBalance() {
            await balance(address, await poolContract.token0())
                .then(value => {
                    setGalaBalance(value / Math.pow(10, 8))
                })
        }
        async function getTownBalance() {
            await balance(address, await poolContract.token1())
                .then(value => {
                    setTownBalance(value / Math.pow(10, 8))
                })
        }

        getGalaBalance();
        getTownBalance();
    }, [address, balance, poolContract])

    const galaPowerScale = {
        1: 1,
        2: 5000,
        3: 10000,
        4: 15000,
        5: 20000,
        6: 25000,
        7: 30000,
        8: 35000,
        9: 40000,
        10: 45000,
        11: 50000,
        12: 55000,
        13: 60000,
        14: 65000,
        15: 70000,
        16: 75000,
        17: 80000,
        18: 85000,
        19: 90000,
        20: 95000,
        21: 100000,
        22: 110000,
        23: 120000,
        24: 130000,
        25: 140000,
        26: 150000,
        27: 160000,
        28: 170000,
        29: 180000,
        30: 190000,
        31: 200000,
        32: 210000,
        33: 220000,
        34: 230000,
        35: 240000,
        36: 250000,
        37: 275000,
        38: 300000,
        39: 325000,
        40: 350000,
        41: 375000,
        42: 400000,
        43: 425000,
        44: 450000,
        45: 475000,
        46: 500000,
        47: 550000,
        48: 600000,
        49: 650000,
        50: 700000,
        51: 750000,
        52: 800000,
        53: 850000,
        54: 900000,
        55: 950000,
        56: 1000000,
        57: 1100000,
        58: 1200000,
        59: 1300000,
        60: 1400000,
        61: 1500000,
        62: 1600000,
        63: 1700000,
        64: 1800000,
        65: 1900000,
        66: 2000000,
        67: 3000000,
        68: 4000000,
        69: 5000000,
        70: 6000000,
        71: 7000000,
        72: 8000000,
        73: 9000000,
        74: 10000000,
        75: 15000000,
        76: 20000000,
        77: 25000000,
        78: 30000000,
        79: 35000000,
        80: 40000000,
        81: 45000000,
        82: 50000000,
        83: 60000000,
        84: 70000000,
        85: 80000000,
        86: 90000000,
        87: 100000000,
        88: 150000000,
        89: 200000000,
        90: 250000000,
        91: 300000000,
        92: 350000000,
        93: 400000000,
        94: 450000000,
        95: 500000000,
        96: 600000000,
        97: 700000000,
        98: 800000000,
        99: 900000000,
        100: 1000000000
    }

    const calculateGalaPowerLevel = (gala, town) => {
        if (!gala && !town) {
            return
        }

        let level = 0

        let galaPower = gala + (town * 2)

        Object.entries(galaPowerScale).forEach(([key, value]) => {
            if (value > galaPower) {
                return;
            }

            level = key;
        });

        return level;
    }

    const handleGPChange = (event) => {
        let gp = event.target.value

        setTownBalance(0)
        setGalaBalance(galaPowerScale[gp] || 0)
        setGPSplit(0)
    }

    const handleGPSplitChange = (event) => {
        let split = event.target.value

        if (gpSplit === split) {
            return
        }

        split *= .01

        const galaPower = galaBalance + (townBalance * 2)

        const newTownBalance = (galaPower * split) / 2;

        setTownBalance(newTownBalance)
        setGalaBalance(galaPower * (1 - split))
        setGPSplit(split * 100)
    }

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item md={9}>
                    <TextField
                        error={!accountValid}
                        helperText={!accountValid ? "Invalid address." : null}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><AccountBalanceWallet/></InputAdornment>,
                        }}
                        label="Address"
                        onInput={(event) => {
                            setAddressUpdated(true)
                            setAddress(event.target.value)
                        }}
                        style={{
                            display: 'flex'
                        }}
                        variant="outlined"
                        value={address}
                    />
                </Grid>
                <Grid item md={3} style={{textAlign: "center"}}>
                    <WalletConnect account={address} setAccount={setAddress.bind(this)} />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item md={3}>
                    <TextField
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><OfflineBolt /></InputAdornment>,
                        }}
                        label="Gala Power"
                        onChange={handleGPChange}
                        variant="outlined"
                        value={calculateGalaPowerLevel(galaBalance, townBalance)}
                    />
                </Grid>
                <Grid item md={3}>
                    <TextField
                        disabled
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><img alt="TOWN" height="35" src="https://app.gala.games/_nuxt/img/GALA-icon.b642e24.png" /></InputAdornment>,
                        }}
                        onInput={() => {}}
                        variant="outlined"
                        value={(galaBalance || 0).toFixed(0)}
                    />
                </Grid>
                <Grid item md={3} style={{ margin: 'auto', marginTop: '25px' }}>
                    <Slider
                        aria-label="Gala and Town Balance"
                        value={gpSplit}
                        onChange={handleGPSplitChange}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        valueLabelFormat={(value) => `${100 - value} / ${value}`}
                    />
                </Grid>
                <Grid item md={3}>
                    <TextField
                        disabled
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><img alt="TOWN" height="35" src="https://app.gala.games/_nuxt/img/TOWN-icon.019cc2f.png" /></InputAdornment>,
                        }}
                        onInput={() => {}}
                        variant="outlined"
                        value={townBalance.toFixed(0)}
                    />
                </Grid>
            </Grid>

            <hr />

            <div style={{textAlign: "center"}}>
                <TextField
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><img alt="TOWN" height="35" src="https://app.gala.games/_nuxt/img/TOWN-icon.019cc2f.png" /></InputAdornment>,
                    }}
                    label="Swap Input"
                    onInput={(event) => setAmountIn(event.target.value)}
                    variant="outlined"
                    value={amountIn}
                />

                <div style={{ display: 'inline-block' }}>
                    <Box
                        margin="15px"
                    >
                        <Typography>
                            1 <img alt="TOWN" height="35" src="https://app.gala.games/_nuxt/img/TOWN-icon.019cc2f.png" style={{verticalAlign: "middle"}} /> = {ratio.toFixed(3)} <img alt="GALA" height="35" src="https://app.gala.games/_nuxt/img/GALA-icon.b642e24.png" style={{verticalAlign: "middle"}} />
                        </Typography>
                    </Box>
                </div>

                <TextField
                    disabled
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><img alt="GALA" height="35" src="https://app.gala.games/_nuxt/img/GALA-icon.b642e24.png" /></InputAdornment>,
                    }}
                    label="Swap Output"
                    variant="outlined"
                    value={quote}
                />
            </div>
        </div>
    );
}