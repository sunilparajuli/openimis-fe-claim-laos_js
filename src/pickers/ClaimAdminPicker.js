import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModulesManager, useTranslations, Autocomplete, useGraphqlQuery } from "@openimis/fe-core";
import _debounce from "lodash/debounce";
import { fetchaAvailableHealthFacilities } from "../actions";


const ClaimAdminPicker = (props) => {
  const {
    onChange,
    readOnly,
    required,
    withLabel = true,
    withPlaceholder,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    multiple,
    extraFragment,
    hfFilter,
    userHealthFacilityId,
  } = props;

  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("claim", modulesManager);
  const [searchString, setSearchString] = useState("");
  const { isLoading, data, error } = useGraphqlQuery(
    `
      query ClaimAdminPicker ($search: String, $hf: String, $user_health_facility: String) {
          claimAdmins(search: $search, first: 20, healthFacility_Uuid: $hf, userHealthFacility: $user_health_facility) {
              edges {
                  node {
                      id
                      uuid
                      code
                      lastName
                      otherNames
                      healthFacility {
                          id uuid code name level
                          servicesPricelist{id, uuid}, itemsPricelist{id, uuid}
                          location {
                              id
                              uuid
                              code
                              name
                              parent {
                                code name id uuid
                              }
                          }
                      }
                      ${extraFragment ?? ""}
                    }
                }
            }
        }
        `,
    { hf: hfFilter?.uuid, search: searchString, user_health_facility: userHealthFacilityId },
    { skip: true },
  );

  // 1# start location
  // const userHealthFacility = useSelector((state) => state.loc.userHealthFacilityFullPath);
  // let pickedDistrictsUuids = [];
  // Array.isArray(district) ? pickedDistrictsUuids = district?.map((district) => district?.uuid) : pickedDistrictsUuids.push(district?.uuid);
  // console.log("pickedDistrictsUuids: ", pickedDistrictsUuids);
  // 1# end

  const dispatch = useDispatch();
  const [variables, setVariables] = useState({});
  const options = useSelector((state) => state.claim?.availablehealthFacilities);
  const region = useSelector((state) => state.core.filtersCache.claimHealthFacilitiesPageFiltersCache?.region?.value?.uuid);
  const district = useSelector((state) => state.core.filtersCache.claimHealthFacilitiesPageFiltersCache?.district?.value?.uuid);
  console.log("region", region); // it does show uuid
  console.log("district", district); // it does show uuid
  // setVariables({ region, district }); // here it goes into inf loop and crashes
  useEffect(async () => {
    setVariables({ region, district });
    await dispatch(
    fetchaAvailableHealthFacilities(modulesManager, variables),
    );
}, []);
//  dispatch(fetchaAvailableHealthFacilities(modulesManager, variables));
  console.log( variables ); // is shows: {region: undefined, district: undefined }


return (
  <Autocomplete
    multiple={multiple}
    required={required}
    placeholder={placeholder ?? formatMessage("ClaimAdminPicker.placeholder")}
    label={label ?? formatMessage("ClaimAdminPicker.label")}
    error={error}
    withLabel={withLabel}
    withPlaceholder={withPlaceholder}
    readOnly={readOnly}
    options={data?.claimAdmins?.edges.map((edge) => edge.node) ?? []}
    isLoading={isLoading}
    value={value}
    getOptionLabel={(option) => `${option.code} ${option.lastName} ${option.otherNames}`}
    onChange={(option) => onChange(option, option ? `${option.code} ${option.lastName} ${option.otherNames}` : null)}
    filterOptions={filterOptions}
    filterSelectedOptions={filterSelectedOptions}
    onInputChange={setSearchString}
  />
);
};

export default ClaimAdminPicker;
