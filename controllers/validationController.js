exports.validationController = (req, res, next) => {
  rule = req.body.rule;
  data = req.body.data;
  field = rule.field;

  /* Checks to ascertain the type of the fields in the JSON payload */
  if (typeof rule !== "object") {
    output = {
      message: "rule should be an object.",
      status: "error",
      data: null,
    };
    res.status(400).json(output);
  }

  if (typeof data !== "object" && typeof data !== "string") {
    output = {
      message: "data should be an object, an array or a string.",
      status: "error",
      data: null,
    };
    res.status(400).json(output);
  }

  /* Checks to ensure that required fields are present in the JSON payload */
  check_field("rule", req.body, res);
  check_field("data", req.body, res);
  check_field("field", rule, res);
  check_field("condition", rule, res);
  check_field("condition_value", rule, res);

  /*Checks that ensures that the field specified in the rule object is present in the data object */
  if (!(`${field}` in data)) {
    output = {
      message: `field ${field} is missing from data.`,
      statuus: "error",
      data: null,
    };
    res.status(400).json(output);
  }

  /* Evaluation of the rule */
  switch (rule.condition) {
    case "eq":
      validation_status = data[`${field}`] === rule.condition_value;
      break;
    case "neq":
      validation_status = data[`${field}`] !== rule.condition_value;
      break;
    case "gt":
      validation_status = data[`${field}`] > rule.condition_value;
      break;
    case "gte":
      validation_status = data[`${field}`] >= rule.condition_value;
      break;
    case "contains":
      validation_status = data[`${field}`]
        .toLowerCase()
        .includes(rule.condition_value.toLowerCase());
      break;
    default:
      validation_status = false;
      break;
  }

  if (validation_status) {
    res.status(200).json({
      message: `field ${field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: field,
          field_value: data[`${field}`],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } else {
    res.status(400).json({
      message: `field ${field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: field,
          field_value: data[`${field}`],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }
};

/*check_field is a helper function that checkes that a field is present in an object */
const check_field = (field, object, res) => {
  if (!(field in object)) {
    output = {
      message: `${field} is required.`,
      statuus: "error",
      data: null,
    };
    res.status(400).json(output);
  }
};
