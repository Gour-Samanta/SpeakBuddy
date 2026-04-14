import "./languageSelector.css";
import Button from "@mui/material/Button";
import { Checkbox, FormControlLabel,FormGroup  } from "@mui/material";
import { useState } from "react";

export default function LanguageSelector({handleLanguage , handleClick}) {
    const [languages, setLanguages] = useState([]);

    const handleChange = (event) => {
  const { value, checked } = event.target;

  if (checked) {
    setLanguages(prev => [...prev, value]);   // add language
  } else {
    setLanguages(prev => prev.filter(lang => lang !== value)); // remove
  }
  
};

  return (
    <div className="container">
    <p>: Select languages you know : </p>
              <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="English"
            onChange={handleChange}
            checked={languages.includes("English")}
          />
        }
        label="English"
      />
    <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Bengali"
            onChange={handleChange}
            checked={languages.includes("Bengali")}
          />
        }
        label="Bengali"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Hindi"
            onChange={handleChange}
            checked={languages.includes("Hindi")}
          />
        }
        label="Hindi"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Tamil"
            onChange={handleChange}
            checked={languages.includes("Tamil")}
          />
        }
        label="Tamil"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Spanish"
            onChange={handleChange}
            checked={languages.includes("Spanish")}
          />
        }
        label="Spanish"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Russian"
            onChange={handleChange}
            checked={languages.includes("Russian")}
          />
        }
        label="Russian"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Punjabi"
            onChange={handleChange}
            checked={languages.includes("Punjabi")}
          />
        }
        label="Punjabi"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="French"
            onChange={handleChange}
            checked={languages.includes("French")}
          />
        }
        label="French"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="German"
            onChange={handleChange}
            checked={languages.includes("German")}
          />
        }
        label="German"
      />
          <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Japanese"
            onChange={handleChange}
            checked={languages.includes("Japanese")}
          />
        }
        label="Japanese"
      />
        <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Marathi"
            onChange={handleChange}
            checked={languages.includes("Marathi")}
          />
        }
        label="Marathi"
      /> <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Odia"
            onChange={handleChange}
            checked={languages.includes("Odia")}
          />
        }
        label="Odia"
      /> <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Nepali"
            onChange={handleChange}
            checked={languages.includes("Nepali")}
          />
        }
        label="Nepali"
      /> 
       <FormControlLabel
        control={
          <Checkbox
            sx={{ color: "white" }}
            value="Urdu"
            onChange={handleChange}
            checked={languages.includes("Urdu")}
          />
        }
        label="Urdu"
      /> 
</FormGroup>
    
      
      <div className="add-btn">
    <Button variant="contained" onClick={()=>{handleLanguage(languages) ; handleClick();}}>Add</Button>
      </div>
    </div>
  );
}
