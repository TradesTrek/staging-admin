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
import { Autocomplete, TextField, Chip } from "@mui/material";

import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
} from "@tabler/icons-react";

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
  FoundedDate: yup.date().nullable(), // Allow null for optional date
  DateListed: yup.date().nullable(),
  Website: yup.string().url("Invalid website URL (optional)"),
  Twitter: yup.string().url("Invalid  URL (optional)"),
  Facebook: yup.string().url("Invalid  URL (optional)"),
  Instagram: yup.string().url("Invalid URL (optional)"),
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
  exchangesData,
  subSectorData,
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

  const arrayOfExchanges = exchangesData.map((e) => e?.name);

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
  const [selectedExchange, setSelectedExchange] = useState(
    defaultValues?.Exchange || ""
  );
  const [selectedExchangeError, setSelectedExchangeError] = useState("");
  const [selectedSubSector, setSelectedSubSector] = useState(
    defaultValues?.Subsector || ""
  );

  const [tags, setTags] = useState(extraDetails?.BoardOfDirectors || []); // State to store board member names
  const handleAddTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      // Check for uniqueness and empty input
      setTags([...tags, newTag]);
    }
  };
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = async (data) => {
    data.BoardOfDirectors = tags;
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

      <Select
        value={selectedExchange}
        onChange={setSelectedExchange}
        label="Exchange"
        placeholder="Enter stock exchange (e.g., NASDAQ)"
        data={arrayOfExchanges}
        clearable
        error={selectedExchangeError}
      />

      <Select
        value={selectedSubSector}
        onChange={setSelectedSubSector}
        label="Subsector"
        placeholder="Enter subsector (optional)"
        data={subSectorData.map((e) => e.name)}
        clearable
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

      <Autocomplete
        multiple
        style={{ marginTop: 10, marginBottom: 10 }}
        id="tags-filled"
        options={tags} // Set options to display existing tags for selection
        freeSolo
        value={tags} // Set value to control the selected tags
        onChange={(event, newTags) => {
          handleAddTag(newTags);
        }} // Update state on selection change
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Board of directors (optional)"
            placeholder="Press Enter to add a new board member"
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              {...getTagProps({ index })}
              onDelete={() => handleDeleteTag(tag)}
              deleteIcon={"k"} // Optional: Customize delete icon
            />
          ))
        }
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

<TextInput
        leftSection={<IconBrandInstagram size={16} />}
        label="Instagram"
        placeholder="Enter Instagram link (optional)"
        {...register("Instagram")}
        error={errors.Instagram?.message}
      />

      <TextInput
        leftSection={<IconBrandFacebook size={16} />}
        label="Facebook"
        placeholder="Enter Facebook Link (optional)"
        {...register("Facebook")}
        error={errors.Facebook?.message}
      />

      <TextInput
        leftSection={<IconBrandTwitter size={16} />}
        label="Twitter"
        placeholder="Enter Twitter URL (optional)"
        {...register("Twitter")}
        error={errors.Twitter?.message}
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
