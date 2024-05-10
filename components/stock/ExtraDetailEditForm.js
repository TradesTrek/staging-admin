import { useForm, Controller } from "react-hook-form";
import { TextInput, Select, Group, NumberInput } from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { stockService } from "../../services/stock.service";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";


const schema = yup.object({
  EmployeeCount: yup.string().notRequired(),
  Exchange: yup.string().required("Exchange is required"),
  Subsector: yup.string(),
  NatureOfBusiness: yup.string(),
  SharesOutstanding: yup.string(),
  CompanyAddress: yup.string(),
  ContactEmail: yup.string().email("Invalid email format"),
  ContactNumber: yup.string(),
  Auditor: yup.string(),
  Registrar: yup.string(),
  CompanySecretary: yup.string(),
  CEO: yup.string(),
  BoardChairperson: yup.string(),
  BoardOfDirectors: yup.string(), 
  FoundedDate: yup.date().nullable(), // Allow null for optional date
  DateListed: yup.date().nullable(),
  Website: yup.string().url("Invalid website URL (optional)"),
  LegalStatus: yup.string(),
  RegulatoryBody: yup.string(),
  PatentsOwned: yup.string(),
  LogoURL: yup.string().url("Invalid logo URL (optional)"),
  Description: yup.string().required("Description is required"),
});

const ExtraStockDetailsEditForm = ({
  shutDown,
  selectedStock,
  setRefetchCounter,
  closeVerticalDots,
  extraDetails,
}) => {
  const defaultValues = {
    ...extraDetails,
    FoundedDate: extraDetails.FoundedDate
      ? moment(extraDetails.FoundedDate).toDate()
      : null,
    DateListed: extraDetails.DateListed
      ? moment(extraDetails.DateListed).toDate()
      : null,
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);
 
  const onSubmit = async (data) => {

    setIsLoading(true);
    try {
      const res = await stockService.updateExtraDetails(
        selectedStock.Symbol,
        data
      );
      setIsLoading(false);
      toast.success(res.message);
      setRefetchCounter((prev) => prev + 1);
      shutDown();
      closeVerticalDots();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <TextInput label="Name" placeholder={selectedStock.Name} disabled />

      <TextInput
        label="Description"
        placeholder="Enter Description"
        {...register("Description", { required: true })}
        error={errors.Description?.message}
      />

      <TextInput
        label="Exchange"
        placeholder="Enter stock exchange (e.g., NASDAQ)"
        {...register("Exchange", { required: true })}
        error={errors.Exchange?.message}
      />
      <TextInput
        label="Subsector"
        placeholder="Enter subsector (optional)"
        {...register("Subsector")}
      />

      <TextInput
        label="EmployeeCount"
        placeholder="Enter Employee Count (optional)"
        {...register("EmployeeCount")}
      />

      <TextInput
        label="Nature of Business"
        placeholder="Enter the nature of business"
        {...register("NatureOfBusiness")}
      />
      <TextInput
        label="Company Address"
        placeholder="Enter company address"
        {...register("CompanyAddress")}
      />
      <TextInput
        label="Contact Email"
        placeholder="Enter contact email"
        {...register("ContactEmail")}
        error={errors.ContactEmail?.message}
      />
      <TextInput
        label="Contact Number"
        placeholder="Enter contact number"
        {...register("ContactNumber")}
      />

      <TextInput
        label="Auditor"
        placeholder="Enter auditor (optional)"
        {...register("Auditor")}
      />
      <TextInput
        label="Registrar"
        placeholder="Enter registrar (optional)"
        {...register("Registrar")}
      />
      <TextInput
        label="Company Secretary"
        placeholder="Enter company secretary (optional)"
        {...register("CompanySecretary")}
      />
      <TextInput
        label="CEO"
        placeholder="Enter CEO (optional)"
        {...register("CEO")}
      />
     
     <TextInput
        label="Board Chairperson"
        placeholder="Enter board chairperson (optional)"
        {...register("BoardChairperson")}
      />

     <TextInput
        label="Board Of Directors (seperate name using comma)"
        placeholder="Board Of Directors (optional)"
        {...register("BoardOfDirectors")}
      />

      <TextInput
        label="Legal Status"
        placeholder="Enter legal status (optional)"
        {...register("LegalStatus")}
      />

      <TextInput
        label="Regulatory Body"
        placeholder="Enter Regulatory Body (optional)"
        {...register("RegulatoryBody")}
      />
      <TextInput
        label="EmployeeCount"
        placeholder="Enter Employee Count (optional)"
        {...register("EmployeeCount")}
      />

      <TextInput
        label="Patents Owned"
        placeholder="Enter PatentsOwned (optional)"
        {...register("PatentsOwned")}
      />

      <TextInput
        label="Market Classification"
        placeholder="Enter market classification (optional)"
        {...register("MarketClassification")}
      />

<TextInput
         label="Shares Outstanding"
         placeholder="Enter number of shares outstanding"
         {...register("SharesOutstanding")}
      />

      <div className="mantine-InputWrapper-root mantine-TextInput-root mantine-1ejqehl">
        <div className="mantine-Input-wrapper mantine-TextInput-wrapper mantine-1v7s5f8">
          <label
            className="mantine-InputWrapper-label mantine-TextInput-label mantine-1fzet7j"
            for="mantine-u4rmpq5qt"
            id="mantine-u4rmpq5qt-label"
          >
            Founded Date
          </label>
          <Controller
            name="FoundedDate"
            control={control}
            render={({ field }) => (
              <ReactDatePicker
                selected={field.value}
                placeholderText="Founded Date"
                wrapperClassName="extraStockpicker"
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        </div>
      </div>

      <div className="mantine-InputWrapper-root mantine-TextInput-root mantine-1ejqehl">
        <div className="mantine-Input-wrapper mantine-TextInput-wrapper mantine-1v7s5f8">
          <label
            className="mantine-InputWrapper-label mantine-TextInput-label mantine-1fzet7j"
            htmlFor="mantine-u4rmpq5qt"
            id="mantine-u4rmpq5qt-label"
          >
            Date Listed
          </label>
          <Controller
            name="DateListed"
            control={control}
            render={({ field }) => (
              <ReactDatePicker
                selected={field.value}
                placeholderText="Date Listed"
                wrapperClassName="extraStockpicker"
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        </div>
      </div>

      <TextInput
        label="Website"
        placeholder="Enter website URL (optional)"
        {...register("Website")}
        error={errors.Website?.message}
      />

      <Button
        style={{ margin: "10px auto", display: "block" }}
        variant="contained"
        type="submit"
      >
        {isLoading ? "Loading" : "Update"}
      </Button>
    </form>
  );
};

export default ExtraStockDetailsEditForm;
