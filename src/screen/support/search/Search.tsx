import {
  FemaleOutlined,
  MaleOutlined,
  SearchOutlined,
  TransgenderOutlined
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchConsumerHandler } from '../../../api/consumer/consumerHandler';
import useConsumerStore from '../../../store/consumerStore';
import NotAvailable from '../../../assets/images/notAvailable.png';
import SearchResult from '../../../assets/images/searchResult.png';
import SearchDefault from './../../../assets/Amico Medical Prescription (1) 1.svg';
import Styles from './Search.module.css';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from './../../../assets/Info.svg';

const Search = () => {
  const [search, setSearch] = useState('');
  const { searchResults, setRegisterUhid } = useConsumerStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      await searchConsumerHandler(search);
    })();
  }, [search]);

  sessionStorage.removeItem('consumerData');
  // console.log(searchResults,"search");
  return (
    <Box>
      <Stack className={Styles.home_section1}>
        <Stack className={Styles.home_title}>
          <Stack className={Styles.title_name}>
            <Stack className={Styles.title_date}> </Stack>
            <Stack>Search</Stack>
          </Stack>
        </Stack>
        <Stack className={Styles.home_searchbar}>
          <Box display={'flex'} flexDirection={'column'}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              gap={'10px'}
            >
              <Stack width={'100%'} position={'relative'}>
                <input
                  type="text"
                  className={Styles.search_input}
                  placeholder=" Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={(e) => searchConsumerHandler(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchConsumerHandler(search);
                    }
                  }}
                />
                <span
                  className={Styles.search_icon}
                  onClick={() => searchConsumerHandler(search)}
                >
                  {' '}
                  <SearchIcon />
                </span>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Stack>
      <Box p={1} my={1} marginBottom={'100px'}>
        {searchResults.length > 0 && (
          <Stack className={Styles.consumer_info} bgcolor={'#FFF'}>
            <Stack className={Styles.consumer_info_icon}>
              <img src={InfoIcon} />
            </Stack>
            <Stack className={Styles.consumer_info_content}>
              Register patient here for further tasks on the registered patient
            </Stack>
          </Stack>
        )}

        {search.length > 0 ? (
          searchResults.length > 0 ? (
            searchResults.map((item) => {
              return (
                <>
                  <Box
                    my={2.2}
                    className={Styles.search_consumer}
                    key={item._id}
                    onClick={() => {
                      navigate(`/consumer/${item._id}`);
                      setRegisterUhid(item.uid);
                    }}
                  >
                    <Stack className={Styles.search_consumer_up}>
                      <Stack className={Styles.search_consumer_up1}>
                        <Stack className={Styles.search_consumer_name}>
                          {item.firstName} {item.lastName && item.lastName}
                        </Stack>
                        <Stack className={Styles.search_consumer_gen_age}>
                          {item.gender && (
                            <Stack className={Styles.search_consumer_gen}>
                              {item.gender}
                            </Stack>
                          )}
                          {/* {dayjs(item.dob).toNow(true)} */}
                          {item.age && (
                            <Stack className={Styles.search_consumer_age}>
                              {item.age}
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                      <Stack className={Styles.search_consumer_up2}>
                        #{item.uid}
                      </Stack>
                    </Stack>
                    {item.phone && (
                      <Stack className={Styles.search_consumer_bot}>
                        Ph: +{item.phone}
                      </Stack>
                    )}
                  </Box>
                </>
              );
            })
          ) : (
            <Stack className={Styles.defaultScreen_container}>
              <Stack className={Styles.imG}>
                <img src={SearchDefault} alt="No Department Selected" />
              </Stack>
              <Stack className={Styles.defaultScreen_text}>
                No Result Found
              </Stack>
            </Stack>
          )
        ) : (
          <Stack className={Styles.defaultScreen_container}>
            <Stack className={Styles.imG}>
              <img src={SearchDefault} alt="No Department Selected" />
            </Stack>
            <Stack className={Styles.defaultScreen_text}>
              Search Patients by entering UHID, Phone Number or Name
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Search;
