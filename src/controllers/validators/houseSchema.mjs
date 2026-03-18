export const getHouseValidationSchema = {
    houseId: {
        isLength: {
            options: {
                min: 36, 
                max: 36
             },
            errorMessage: 
                "must be a 36 character UUID string"
            }
    }
}

export const updateHouseValidationSchema = {
    id: {
        isLength: {
            options: {
                min: 36, 
                max: 36
             },
            errorMessage: 
                "must be a 36 character UUID string"
            }
    },
    title: {
        isLength: { 
            options: {
                min: 3,
                max: 30
            },
            errorMessage:
                "must be 3 to 30 characters in length"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    companyName: {
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    rooms: {
        isInt: {
            options: {
                min: 3,
                max: 15
            },
            errorMessage:
                "must be a whole number from 3 to 15"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    garages: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    garages: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    storyCount: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must be a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    floorAreaSqm: {
        isInt: {
            options: {
                min: 200,
                max: 800
            },
            errorMessage:
                "must a whole number from 200 to 800"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },     

}

export const addHouseValidationSchema = {
    title: {
        isLength: { 
            options: {
                min: 3,
                max: 30
            },
            errorMessage:
                "must be 3 to 30 characters in length"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    companyName: {
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    rooms: {
        isInt: {
            options: {
                min: 3,
                max: 15
            },
            errorMessage:
                "must be a whole number from 3 to 15"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    garages: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    garages: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    storyCount: {
        isInt: {
            options: {
                min: 1,
                max: 2
            },
            errorMessage:
                "must be a whole number from 1 to 2"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },
    floorAreaSqm: {
        isInt: {
            options: {
                min: 200,
                max: 800
            },
            errorMessage:
                "must a whole number from 200 to 800"
        },
        notEmpty: {
            errorMessage: 
                "cannot be empty"
        }
    },     
    extras: {
        isArray: {
            errorMessage:
                "must be an array"
        }
    },
}