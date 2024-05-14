import Head from "next/head";
import { Select, Button, Modal, Checkbox, Stack } from "@mantine/core";
import SideBar from "../../components/side-bar/SideBar";
import { stockService } from "../../services/stock.service";
import { List, ListItem, ListItemText } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function Sectors() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState("");
  const [sector, setSector] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSector, setSelectedSector] = useState("");
  const [allSectors, setAllSector] = useState([]);
  const [isAddLoading, setIsAddLoading] = useState("");
  const [isEditModal, setIsEditModal] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [refetch, setRefetch] = useState(0);
  
  useEffect(() => {
    stockService
      .StocksNotSuspended()
      .then((res) => {
        if (res.success) {
          const arrayOfSymbols = res.data.map((e) => e.Symbol);
          setStocks(arrayOfSymbols);
          setStockData(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    stockService
      .getAllStockSectors()
      .then((res) => {
        if (res.success) {
          setAllSector(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    const selectedData = stockData.filter((e) => e.Symbol === selectedStock);
    if (!selectedData.length) return;
    const selectedObject = selectedData[0];

    stockService
      .getStockSector(selectedObject._id)
      .then((res) => {
        if (res.success) {
          setSector(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [selectedStock, refetch]);

 
  const addStockToSector = async () => {
    try {
      setIsAddLoading(true);
      if (!selectedStock) return;
      const selectedData = stockData.filter((e) => e.Symbol === selectedStock);
      if (!selectedData.length) return;
      const selectedObject = selectedData[0];
     const response = await stockService.applySectorToStock({
        stockId: selectedObject._id,
        sectorId: selectedSector,

      });

      if(response.success){
        setSelectedSector("");
        toast.success("Added successfuly");
        setRefetch(refetch + 1)
        close();
        setIsAddLoading(false);
      }else{
        setIsAddLoading(false);
        toast.error(response.message);

        close();
       setSelectedSector("");
      }

  
    } catch (error) {
      setIsAddLoading(false);
      toast.error(error.message);
    }
  };

  const updateSector = async () => {
    try {
      setIsAddLoading(true);
      if (!selectedStock) return;
      const selectedData = stockData.filter((e) => e.Symbol === selectedStock);
      if (!selectedData.length) return;
      const selectedObject = selectedData[0];
      await stockService.updateApplySectorToStock({
        stockId: selectedObject._id,
        sectorId: selectedSector,
      });
      setRefetch(refetch + 1)
    
      toast.success("Updated successfuly");
    
      close();
      setIsAddLoading(false);
    } catch (error) {
      setIsAddLoading(false);
      toast.error(error.message);
    }
  };

  const View = () => {
    if (isLoading || isAddLoading) {
      return <p>Loading</p>;
    }

    if (selectedStock) {
      if (sector?.category) {
        return (
          <>
            <p
              style={{
                color: "black",
                fontWeight: "bolder",
                marginBottom: 10,
              }}
            >
              {sector?.category}
            </p>
            <Button
              variant="filled"
              onClick={() => {
                setIsEditModal(true);
                setSelectedSector(sector?._id);
                open();
              }}
              style={{ background: "indigo" }}
            >
              Change sector
            </Button>
          </>
        );
      } else {
        return (
          <Button
            variant="filled"
            onClick={() => {
              setIsEditModal(false);
              open();
            }}
            style={{ background: "indigo" }}
          >
            Add to a sector
          </Button>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>Stock sectors </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <Modal
        opened={opened}
        onClose={() => {
          close();
        }}
        title={isEditModal ? "Update" : "Add sector"}
      >
        <Stack>
          {allSectors.map((e, i) => (
            <Checkbox
              checked={e._id === selectedSector}
              key={i}
              onChange={() => {
                if (e._id === selectedSector) {
                  setSelectedSector("");
                } else {
                  setSelectedSector(e._id);
                }
              }}
              label={e.category}
            />
          ))}

          <Button
            className="m-4"
            variant="filled"
            disabled={isAddLoading || !selectedSector}
            style={{ background: "indigo", margin: "10px", float: "right" }}
            onClick={() => {
              isEditModal ? updateSector() : addStockToSector();
            }}
          >
            {isAddLoading ? "Loading" : isEditModal ? "Update" : "Add"}
          </Button>
        </Stack>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="dashboard sideBarOpen">
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">Stock sectors</h1>

            <Select
              label=""
              placeholder="Pick a stock"
              data={stocks}
              value={selectedStock}
              onChange={setSelectedStock}
              searchable
            />

            <br />
            <br />
            <br />

            <View />
          </div>
        </div>
      </div>
    </>
  );
}
