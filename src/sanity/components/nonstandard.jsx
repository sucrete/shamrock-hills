import { Stack, Box, Card, Grid, Text, Tooltip, MenuButton, Menu } from '@sanity/ui';

// go here to edit/add utils
import { useRenderers } from '../utils/renderers';

export const NonStandard = (props) => {
  const {
    value, // The current value object
    onChange, // Sanity's patch function
    members = [], // Validation (wrapped in) passed from Sanity
    elementProps,
  } = props;

  const { renderRateField, renderTextField, renderTextAreaField, renderButton, errorMessages } = useRenderers({
    value,
    onChange,
    members,
  });

  return (
    <Stack className="rate-stack rate-stack-non-standard">
      <span tabIndex={-1} {...elementProps} style={{ outline: 'none', display: 'block', height: 0 }} />
      <Card>
        <Stack>
          {/* Validation Error Display (Above Grid) */}
          {errorMessages.length > 0 && (
            <Card padding={3} radius={2} tone="critical" shadow={1} border>
              <Stack space={2}>
                <Text weight="bold" size={1}>
                  Please correct the following errors:
                </Text>
                {errorMessages.map((msg, i) => (
                  <Text key={i} size={1}>
                    {msg}
                  </Text>
                ))}
              </Stack>
            </Card>
          )}

          {/* HEADING */}
          <Card>
            <Stack>
              <Text weight="medium" size={1} style={{ paddingTop: '.75rem', paddingBottom: '1.3rem' }}>
                Heading
              </Text>
              {renderTextField('ratesHeading', '', '3')}
            </Stack>
          </Card>

          {/* DESCRIPTION */}
          <Card style={{ paddingBottom: '3rem' }}>
            <Stack>
              <Text weight="medium" size={1} style={{ paddingTop: '4rem', paddingBottom: '1.3rem' }}>
                Description
              </Text>
              {renderTextAreaField('ratesDescription')}
            </Stack>
          </Card>

          {/* Your Grid Layout */}
          <Grid columns={2} gap={1} style={{ alignItems: 'center' }}>
            {/* --- Header Row --- */}
            <Card>
              <Text></Text>
            </Card>
            <Card padding={3}>
              <Text weight="semibold" style={{ textAlign: 'center' }} className="th">
                Price
              </Text>
            </Card>

            {/* --- Row 1 --- */}
            <Card className="firstCellCard" style={{ paddingLeft: '0px' }}>
              {renderTextField('ADMTitle', 'firstCell', '3', { paddingLeft: '0px', fontWeight: '600' })}

              <Tooltip
                content={
                  <Box padding={1}>
                    <Text size={1}>Edit definition</Text>
                  </Box>
                }
                animate
                fallbackPlacements={['right', 'left']}
                placement="top"
                portal>
                <span>
                  <MenuButton
                    button={renderButton()}
                    id="menu-button-example"
                    menu={<Menu>{renderTextField('ADMTitleDef', 'firstCellButton', '3')}</Menu>}
                    popover={{ portal: false, placement: 'bottom' }}
                  />
                </span>
              </Tooltip>
            </Card>
            <Card>{renderRateField('ADMPrice')}</Card>

            {/* --- Row 2 --- */}
            <Card className="firstCellCard" style={{ paddingLeft: '0px' }}>
              {renderTextField('collegeStudentTitle', 'firstCell', '3', { paddingLeft: '0px', fontWeight: '600' })}

              <Tooltip
                content={
                  <Box padding={1}>
                    <Text size={1}>Edit definition</Text>
                  </Box>
                }
                animate
                fallbackPlacements={['right', 'left']}
                placement="top"
                portal>
                <span>
                  <MenuButton
                    button={renderButton()}
                    id="menu-button-example"
                    menu={<Menu>{renderTextField('collegeStudentTitleDef', 'firstCellButton', '3')}</Menu>}
                    popover={{ portal: false, placement: 'bottom' }}
                  />
                </span>
              </Tooltip>
            </Card>
            <Card>{renderRateField('collegeStudentPrice')}</Card>

            {/* --- Row 3 --- */}
            <Card className="firstCellCard" style={{ paddingLeft: '0px' }}>
              {renderTextField('adultHandicapTitle', 'firstCell', '3', { paddingLeft: '0px', fontWeight: '600' })}

              <Tooltip
                content={
                  <Box padding={1}>
                    <Text size={1}>Edit definition</Text>
                  </Box>
                }
                animate
                fallbackPlacements={['right', 'left']}
                placement="top"
                portal>
                <span>
                  <MenuButton
                    button={renderButton()}
                    id="menu-button-example"
                    menu={<Menu>{renderTextField('adultHandicapTitleDef', 'firstCellButton', '3')}</Menu>}
                    popover={{ portal: false, placement: 'bottom' }}
                  />
                </span>
              </Tooltip>
            </Card>
            <Card>{renderRateField('adultHandicapPrice')}</Card>

            {/* --- Row 4 --- */}
            <Card className="firstCellCard" style={{ paddingLeft: '0px' }}>
              {renderTextField('juniorHandicapTitle', 'firstCell', '3', { paddingLeft: '0px', fontWeight: '600' })}

              <Tooltip
                content={
                  <Box padding={1}>
                    <Text size={1}>Edit definition</Text>
                  </Box>
                }
                animate
                fallbackPlacements={['right', 'left']}
                placement="top"
                portal>
                <span>
                  <MenuButton
                    button={renderButton()}
                    id="menu-button-example"
                    menu={<Menu>{renderTextField('juniorHandicapTitleDef', 'firstCellButton', '3')}</Menu>}
                    popover={{ portal: false, placement: 'bottom' }}
                  />
                </span>
              </Tooltip>
            </Card>
            <Card>{renderRateField('juniorHandicapPrice')}</Card>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
};
