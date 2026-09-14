const rateValidation = (Rule) => [
  Rule.regex(/^([0-9$.,-]+|n\/a)$/i).error('Only numbers, dollar signs ($), periods (.), commas (,), dashes (-), or "n/a" are allowed.'),
  Rule.max(10).error('Character limit reached.'),
]
export default rateValidation;