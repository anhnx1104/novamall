import classes from "./table.module.css";
import { useEffect, useState } from "react";
import { Search } from "@styled-icons/bootstrap";
import {
  Paper,
  InputBase,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { Iconify } from "../iconify";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  InputAdornment,
  Button,
} from "@mui/material"

const FilterComponent = ({ filterText,isSpecialProduct, onFilter, onClear, placeholder }) => {
  const [data, setData] = useState("");
  const [category, setCategory] = useState("all")
  const [category1, setCategory1] = useState("all")
  const [category2, setCategory2] = useState("1")
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [active, setActive] = useState("전체");

  const filters = ["전체", "판매중", "숨김", "품절"];

  function handleCategoryChange(e) {
    setCategory(e.target.value)
  }
    function handleCategoryChange2(e) {
    setCategory2(e.target.value)
  }
 function handleCategoryChange1(e) {
    setCategory1(e.target.value)
  }

  function handleTabChange(e, newValue) {
    setTabValue(newValue)
  }

  function handleSearch() {
    onFilter(data);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onFilter(data);
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      onClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
      <Box width="100%" sx={{pt: 2, pb: 2}} >
        {/* Filter Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          {/* Category Dropdown */}
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="category-label">전체 상품군</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={category}
              label="전체 상품군"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">전체 상품군</MenuItem>
              <MenuItem value="electronics">전자제품</MenuItem>
              <MenuItem value="clothing">의류</MenuItem>
              <MenuItem value="books">도서</MenuItem>
              <MenuItem value="home">홈 & 가든</MenuItem>
            </Select>
          </FormControl>
          {isSpecialProduct && (
            <FormControl sx={{ minWidth: 200, ml: 2 }} size="small">
            <InputLabel id="category-label">전체 상품군</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={category2}
              label="전체 상품군"
              onChange={handleCategoryChange2}
            >
             <MenuItem  value="1">전체 (인기)</MenuItem>
    <MenuItem value="popular_electronics">인기 전자제품</MenuItem>
    <MenuItem value="popular_clothing">인기 의류</MenuItem>
    <MenuItem value="popular_books">인기 도서</MenuItem>
    <MenuItem value="popular_home">인기 홈 & 가든</MenuItem>
            </Select>
          </FormControl>
          )}
          {/* Search Bar */}
          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
      {filters.map((label, index) => (
        <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => setActive(label)}
            sx={{
              minWidth: "auto",
              p: 0,
              textTransform: "none",
              color: active === label ? "#1976d2" : "#333",
              fontWeight: active === label ? 600 : 400,
              background: "none",
              border: "none",
              "&:hover": {
                background: "transparent",
                color: "#1976d2",
              },
            }}
          >
            {label}
          </Button>
          {index < filters.length - 1 && (
            <Box component="span" sx={{ mx: 1, color: "#999" }}>
              |
            </Box>
          )}
        </Box>
      ))}
    </Box>
            <TextField
              placeholder="상품명 or 코드 입력"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
                         InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  ),
                }}
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#666",
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              검색
            </Button>
          </Box>
        </Box>
 <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
   <FormControl  size="small">
            <InputLabel id="category-label">전체 상품군</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={category1}
              label="전체 상품군"
              onChange={handleCategoryChange1}
            >
              <MenuItem value="all">전체 상품군</MenuItem>
              <MenuItem value="onSale">판매중</MenuItem>
              <MenuItem value="hidden">숨김</MenuItem>
              <MenuItem value="soldOut">품절</MenuItem>
            </Select>
          </FormControl>
               <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#666",
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              일괄변경
            </Button>
 </Box>
    </Box>
  );
};
export default FilterComponent;
