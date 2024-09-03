'use client'
import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Chip, Tabs, Tab, TextField, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { Autocomplete } from '@mui/material';


const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    minWidth: 0,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const ProfileForm = ({ profileId, logedUser, calculateFilledTabsCount, setCalculateFilledTabsCount }) => {
    const [tabValue, setTabValue] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [verifyTrigger, setVerifyTrigger] = useState(0);
    const [formData, setFormData] = useState({
        employeeId: '',
        skills: [],
        bankDetails: { bankName: '', accountNumber: '', ifscCode: '', panCardNumber: '', panCardImage: null },
        addressDetails: { permanentAddress: '', currentAddress: '', aadhaarCardNumber: '', aadhaarFrontImage: null, aadhaarBackImage: null },
        academics: { tenthDetails: '', twelfthDetails: '', graduationDetails: '' },
        pastExperience: [{ companyName: '', fromYear: '', toYear: '' }],
        verify: false
    });

    console.log("profileId", profileId);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            },
        }));
    };

    const handleFileChange = (section, field, file) => {
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: file,
            },
        }));
    };

    useEffect(() => {
        const checkIfExist = async () => {
            try {
                const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/profile/${profileId}`, {
                    method: 'GET',
                });

                if (checkResponse.ok) {
                    const data = await checkResponse.json();
                    setUpdating(true); // Profile exists
                    populateFormData(data);
                } else if (checkResponse.status === 404) {
                    setUpdating(false); // Profile does not exist
                }
            } catch (error) {
                console.error('Error checking profile existence:', error);
                setUpdating(false);
            }
        };

        if (profileId) {
            checkIfExist();
        }
    }, [profileId, verifyTrigger]);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            employeeId: profileId,
        }));
    }, [profileId]);

    const populateFormData = (data) => {
        console.log("dataaaaa", data);

        setFormData({
            employeeId: data.employeeId || '',
            skills: data.skills || [],
            bankDetails: {
                bankName: data.bankDetails?.bankName || '',
                accountNumber: data.bankDetails?.accountNumber || '',
                ifscCode: data.bankDetails?.ifscCode || '',
                panCardNumber: data.bankDetails?.panCardNumber || '',
                panCardImage: data.bankDetails?.panCardImageUrl, // URL from AWS
            },
            addressDetails: {
                permanentAddress: data.addressDetails?.permanentAddress || '',
                currentAddress: data.addressDetails?.currentAddress || '',
                aadhaarCardNumber: data.addressDetails?.aadhaarCardNumber || '',
                aadhaarFrontImage: data.addressDetails?.aadhaarFrontImageUrl, // URL from AWS
                aadhaarBackImage: data.addressDetails?.aadhaarBackImageUrl, // URL from AWS
            },
            academics: {
                tenthDetails: data.academics?.tenthDetails || '',
                twelfthDetails: data.academics?.twelfthDetails || '',
                graduationDetails: data.academics?.graduationDetails || '',
            },
            pastExperience: data.pastExperience.length > 0 ? data.pastExperience : [{ companyName: '', fromYear: '', toYear: '' }],
            verify: data.verify
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        // Append simple data (strings, numbers)
        const appendData = (key, value) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value);
            }
        };

        appendData('employeeId', formData.employeeId);

        // Append all fields
        appendData('skills', formData.skills.join(',')); // join skills array as a comma-separated string

        Object.entries(formData.bankDetails).forEach(([key, value]) => {
            appendData(`bankDetails_${key}`, value);
        });

        Object.entries(formData.addressDetails).forEach(([key, value]) => {
            appendData(`addressDetails_${key}`, value);
        });

        Object.entries(formData.academics).forEach(([key, value]) => {
            appendData(`academics_${key}`, value);
        });

        formData.pastExperience.forEach((exp, index) => {
            Object.entries(exp).forEach(([key, value]) => {
                appendData(`pastExperience_${index}_${key}`, value);
            });
        });

        // Append files separately
        appendData('panCardImage', formData.panCardImage); // Assuming these are file inputs
        appendData('aadhaarFrontImage', formData.aadhaarFrontImage);
        appendData('aadhaarBackImage', formData.aadhaarBackImage);

        appendData('verify', formData.verify);

        try {

            const url = updating
                ? `${process.env.NEXT_PUBLIC_APP_URL}/profile/updateByProfileId/${profileId}`
                : `${process.env.NEXT_PUBLIC_APP_URL}/profile/create`;

            const response = await fetch(url, {
                method: updating ? 'PUT' : 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                console.log('Profile submitted/updated successfully');
                setVerifyTrigger(prev => prev + 1);
            } else {
                console.error('Failed to submit/update profile');
            }
        } catch (error) {
            console.error('Error submitting/updating profile:', error);
        }
    };

    const handleVerifyProfile = async (val) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/profile/updateByVerifyStatus/${profileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    verify: val,
                }),
            });

            if (response.ok) {
                console.log('Profile verified successfully');
                setVerifyTrigger(prev => prev + 1);
            } else {
                console.error('Failed to verify profile');
            }
        } catch (error) {
            console.error('Error verifying profile:', error);
        }
    };

    const SectionTitle = ({ iconClass, title }) => (
        <div className="flex items-center space-x-2 mb-2">
            <i className={`${iconClass} text-xl text-blue-500`}></i>
            <h6 className="text-lg font-semibold text-blue-700">{title}</h6>
        </div>
    );

    const tabContent = [
        {
            label: 'Skills',
            content: (
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.skills}
                    onChange={(event, newValue) => setFormData(prev => ({ ...prev, skills: newValue }))}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Skills"
                            placeholder="Press Enter to Add more skills"
                            fullWidth
                        />
                    )}
                />
            ),
        },
        {
            label: 'Bank Details',
            content: (
                <>
                    <TextField
                        label="Bank Name"
                        fullWidth
                        margin="normal"
                        value={formData.bankDetails.bankName}
                        onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                    />
                    <TextField
                        label="Account Number"
                        fullWidth
                        margin="normal"
                        value={formData.bankDetails.accountNumber}
                        onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                    />
                    <TextField
                        label="IFSC Code"
                        fullWidth
                        margin="normal"
                        value={formData.bankDetails.ifscCode}
                        onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                    />
                    <TextField
                        label="PAN Card Number"
                        fullWidth
                        margin="normal"
                        value={formData.bankDetails.panCardNumber}
                        onChange={(e) => handleInputChange('bankDetails', 'panCardNumber', e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) => handleFileChange('bankDetails', 'panCardImage', e.target.files[0])}
                    />
                </>
            ),
        },
        {
            label: 'Address',
            content: (
                <>
                    <TextField
                        label="Permanent Address"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.addressDetails.permanentAddress}
                        onChange={(e) => handleInputChange('addressDetails', 'permanentAddress', e.target.value)}
                    />
                    <TextField
                        label="Current Address"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.addressDetails.currentAddress}
                        onChange={(e) => handleInputChange('addressDetails', 'currentAddress', e.target.value)}
                    />

                    <TextField
                        label="Aadhaar Card Number"
                        fullWidth
                        margin="normal"
                        value={formData.addressDetails.aadhaarCardNumber}
                        onChange={(e) => handleInputChange('addressDetails', 'aadhaarCardNumber', e.target.value)}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Aadhaar Card Front Image</Typography>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('addressDetails', 'aadhaarFrontImage', e.target.files[0])}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Aadhaar Card Back Image</Typography>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('addressDetails', 'aadhaarBackImage', e.target.files[0])}
                        />
                    </Box>
                </>
            ),
        },
        {
            label: 'Academics',
            content: (
                <>
                    <TextField
                        label="10th Details"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        value={formData.academics.tenthDetails}
                        onChange={(e) => handleInputChange('academics', 'tenthDetails', e.target.value)}
                    />
                    <TextField
                        label="12th Details"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        value={formData.academics.twelfthDetails}
                        onChange={(e) => handleInputChange('academics', 'twelfthDetails', e.target.value)}
                    />
                    <TextField
                        label="Graduation Details"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={formData.academics.graduationDetails}
                        onChange={(e) => handleInputChange('academics', 'graduationDetails', e.target.value)}
                    />
                </>
            ),
        },
        {
            label: 'Experience',
            content: (
                <>
                    {formData.pastExperience.map((exp, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Experience {index + 1}</Typography>
                            <TextField
                                label="Company Name"
                                fullWidth
                                margin="normal"
                                value={exp.companyName}
                                onChange={(e) => {
                                    const newExperience = [...formData.pastExperience];
                                    newExperience[index].companyName = e.target.value;
                                    setFormData(prev => ({ ...prev, pastExperience: newExperience }));
                                }}
                            />
                            <TextField
                                label="From Year"
                                fullWidth
                                margin="normal"
                                value={exp.fromYear}
                                onChange={(e) => {
                                    const newExperience = [...formData.pastExperience];
                                    newExperience[index].fromYear = e.target.value;
                                    setFormData(prev => ({ ...prev, pastExperience: newExperience }));
                                }}
                            />
                            <TextField
                                label="To Year"
                                fullWidth
                                margin="normal"
                                value={exp.toYear}
                                onChange={(e) => {
                                    const newExperience = [...formData.pastExperience];
                                    newExperience[index].toYear = e.target.value;
                                    setFormData(prev => ({ ...prev, pastExperience: newExperience }));
                                }}
                            />
                        </Box>
                    ))}
                    <Button
                        variant="outlined"
                        onClick={() => setFormData(prev => ({
                            ...prev,
                            pastExperience: [...prev.pastExperience, { companyName: '', fromYear: '', toYear: '' }]
                        }))}
                    >
                        Add More Experience
                    </Button>
                </>
            ),
        },
        {
            label: 'Preview & Submit',
            content: (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                    <h4 className="text-center mb-6 text-2xl font-bold text-gray-800">Preview</h4>

                    <div className="space-y-6">
                        <section>
                            <SectionTitle iconClass="ri-user-3-line" title="Skills" />
                            <p className="text-gray-700">{formData.skills.join(', ') || 'No skills added'}</p>
                        </section>

                        <hr className="border-t border-gray-200" />

                        <section>
                            <SectionTitle iconClass="ri-bank-card-line" title="Bank Details" />
                            <div className="grid grid-cols-2 gap-2 text-gray-700">
                                <p>Bank Name: {formData.bankDetails.bankName || 'N/A'}</p>
                                <p>Account Number: {formData.bankDetails.accountNumber || 'N/A'}</p>
                                <p>IFSC Code: {formData.bankDetails.ifscCode || 'N/A'}</p>
                                <p>PAN Card Number: {formData.bankDetails.panCardNumber || 'N/A'}</p>
                            </div>
                            {formData.bankDetails.panCardImage && (
                                <Box sx={{ mt: 2, pl: 2 }}>
                                    <Typography variant="subtitle2">PAN Card Image:</Typography>
                                    <img
                                        src={formData.bankDetails.panCardImage instanceof File
                                            ? URL.createObjectURL(formData.bankDetails.panCardImage)
                                            : formData.bankDetails.panCardImage}
                                        alt="PAN Card"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
                                    />
                                </Box>
                            )}
                        </section>

                        <hr className="border-t border-gray-200" />

                        <section>
                            <SectionTitle iconClass="ri-map-pin-2-line" title="Address Details" />
                            <p className="text-gray-700">Permanent Address: {formData.addressDetails.permanentAddress || 'N/A'}</p>
                            <p className="text-gray-700">Current Address: {formData.addressDetails.currentAddress || 'N/A'}</p>
                            <p className="text-gray-700">Aadhaar Card Number: {formData.addressDetails.aadhaarCardNumber || 'N/A'}</p>
                            <div className="flex space-x-4 mt-2">
                                {formData.addressDetails.aadhaarFrontImage && (
                                    <Box sx={{ mt: 2, pl: 2 }}>
                                        <Typography variant="subtitle2">Aadhaar Front Image:</Typography>
                                        <img
                                            src={formData.addressDetails.aadhaarFrontImage instanceof File
                                                ? URL.createObjectURL(formData.addressDetails.aadhaarFrontImage)
                                                : formData.addressDetails.aadhaarFrontImage}
                                            alt="Aadhaar Front"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
                                        />
                                    </Box>
                                )}
                                {formData.addressDetails.aadhaarBackImage && (
                                    <Box sx={{ mt: 2, pl: 2 }}>
                                        <Typography variant="subtitle2">Aadhaar Back Image:</Typography>
                                        <img
                                            src={formData.addressDetails.aadhaarBackImage instanceof File
                                                ? URL.createObjectURL(formData.addressDetails.aadhaarBackImage)
                                                : formData.addressDetails.aadhaarBackImage}
                                            alt="Aadhaar Back"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
                                        />
                                    </Box>
                                )}
                            </div>
                        </section>

                        <hr className="border-t border-gray-200" />

                        <section>
                            <SectionTitle iconClass="ri-book-open-line" title="Academics" />
                            <div className="grid grid-cols-2 gap-2 text-gray-700">
                                <p>10th Details: {formData.academics.tenthDetails || 'N/A'}</p>
                                <p>12th Details: {formData.academics.twelfthDetails || 'N/A'}</p>
                                <p className="col-span-2">Graduation Details: {formData.academics.graduationDetails || 'N/A'}</p>
                            </div>
                        </section>

                        <hr className="border-t border-gray-200" />

                        <section>
                            <SectionTitle iconClass="ri-briefcase-4-line" title="Past Experience" />
                            {formData.pastExperience.length > 0 ? (
                                <div className="space-y-4">
                                    {formData.pastExperience.map((exp, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                                            <p className="font-semibold">{exp.companyName || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">
                                                {exp.fromYear || 'N/A'} - {exp.toYear || 'N/A'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-700">No past experience added</p>
                            )}
                        </section>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        {updating ? "Update" : "Submit"}
                    </button>
                </div>
            ),
        }
    ];

    const calculateFilledTabs = () => {
        let filledCount = 0;

        // Skills tab (up to 1 point)
        filledCount += Math.min(formData.skills.length, 3) / 3;

        // Bank Details tab (up to 1 point)
        if (formData.bankDetails.bankName) filledCount += 1 / 4;
        if (formData.bankDetails.accountNumber) filledCount += 1 / 4;
        if (formData.bankDetails.ifscCode) filledCount += 1 / 4;
        if (formData.bankDetails.panCardNumber) filledCount += 1 / 4;

        // Address Details tab (up to 1 point)
        if (formData.addressDetails.permanentAddress) filledCount += 1 / 3;
        if (formData.addressDetails.currentAddress) filledCount += 1 / 3;
        if (formData.addressDetails.aadhaarCardNumber) filledCount += 1 / 3;

        // Academics tab (up to 1 point)
        if (formData.academics.tenthDetails) filledCount += 1 / 3;
        if (formData.academics.twelfthDetails) filledCount += 1 / 3;
        if (formData.academics.graduationDetails) filledCount += 1 / 3;

        // Past Experience tab (up to 1 point)
        if (formData.pastExperience.some(exp => exp.companyName)) filledCount += 1 / 3;
        if (formData.pastExperience.some(exp => exp.fromYear)) filledCount += 1 / 3;
        if (formData.pastExperience.some(exp => exp.toYear)) filledCount += 1 / 3;

        return (filledCount / (tabContent.length - 1)) * 100;
    };

    useEffect(() => {
        if (calculateFilledTabs()) {
            setCalculateFilledTabsCount(calculateFilledTabs());
        }
    }, [calculateFilledTabs()]);

    const areDetailsComplete = () => {
        const bankDetailsComplete =
            formData.bankDetails.bankName &&
            formData.bankDetails.accountNumber &&
            formData.bankDetails.ifscCode &&
            formData.bankDetails.panCardNumber;

        const addressDetailsComplete =
            formData.addressDetails.permanentAddress &&
            formData.addressDetails.currentAddress &&
            formData.addressDetails.aadhaarCardNumber;

        return bankDetailsComplete && addressDetailsComplete;
    };

    if (logedUser.id === profileId || Number(logedUser.role) < 3) {
        return (
            <>
                <form onSubmit={handleSubmit}>

                    <StyledTabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                        {tabContent.map((tab, index) => (
                            <StyledTab key={index} label={tab.label} />
                        ))}
                    </StyledTabs>

                    <Box sx={{ p: 3 }}>
                        {tabContent[tabValue].content}
                    </Box>

                </form >

                <Divider />
                {Number(logedUser.role) < 3 &&
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={() => handleVerifyProfile(true)}
                            disabled={!updating || formData.verify}
                            variant='contained'
                            sx={{ margin: "10px" }}
                        >
                            {formData.verify ? 'Profile Verified' : 'Verify Profile'}
                        </Button>
                        {formData.verify &&
                            <Button
                                onClick={() => handleVerifyProfile(false)}
                                disabled={!formData.verify}
                                variant='contained'
                                color='error'
                                sx={{ margin: "10px" }}
                            >
                                marked as unverified
                            </Button>
                        }
                    </Box>
                }
            </>
        );
    } else {
        return null;
    }


}

export default ProfileForm
