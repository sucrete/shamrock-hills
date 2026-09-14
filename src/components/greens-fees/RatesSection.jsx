'use client';

import RevealAnimation from '../animation/RevealAnimation';

const standardRows = ['row1', 'row2', 'row3', 'row4', 'row5'];
const miscRows = ['row1', 'row2', 'row3'];

const RatesSection = ({ ratesSectionData }) => {
  if (!ratesSectionData) return null;
  const { standard, misc } = ratesSectionData;

  return (
    <section
      className="rates-section pt-[5rem] md:pt-[9rem] lg:pt-[12rem] pb-[9rem] md:pb-[9rem] lg:pb-[12rem] bg-background-2"
      id="rates">
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="table-wrapper">
            <div className="table-preface pb-5">
              <h3 className="lg:max-w-1/2 pb-[.7rem]">{standard.standardRatesHeading}</h3>
              {standard.standardRatesDescription && (
                <p className="lg:max-w-1/2">{standard.standardRatesDescription} </p>
              )}
            </div>
            <table className="table-auto table-striped table-striped-3">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">
                    <div className="th-wrap">Mon-Thurs</div>
                  </th>
                  <th scope="col">
                    <div className="th-wrap">Fri-Sun</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {standardRows.map((prefix) => {
                  const title = standard[`${prefix}Title`];
                  if (!title) return null;
                  const titleDef = standard[`${prefix}TitleDef`];
                  return (
                    <tr key={prefix}>
                      <th scope="row">
                        <div className="th-wrap">{title}</div>
                        {titleDef?.length > 0 && <div className="note">{titleDef}</div>}
                      </th>
                      <td>
                        <div>{standard[`${prefix}MonThurs`]}</div>
                      </td>
                      <td>
                        <div>{standard[`${prefix}FriSun`]}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RevealAnimation>
        <RevealAnimation delay={0.1}>
          <div className="table-wrapper pt-[5rem] md:pt-[7rem]">
            <hr className="opacity-10 pb-[2rem]" />
            <div className="table-preface pb-5">
              <h3 className="lg:max-w-1/2 pb-[.7rem]">{misc.miscHeading}</h3>
              {misc.miscDescription?.length > 0 && <p className="lg:max-w-1/2">{misc.miscDescription} </p>}
            </div>
            <table className="table-auto table-striped table-striped-3">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">
                    <div className="th-wrap">Price</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {miscRows.map((prefix) => {
                  const title = misc[`${prefix}Title`];
                  if (!title) return null;
                  const titleDef = misc[`${prefix}TitleDef`];
                  return (
                    <tr key={prefix}>
                      <th scope="row">
                        <div className="th-wrap">{title}</div>
                        {titleDef?.length > 0 && <div className="note">{titleDef}</div>}
                      </th>
                      <td>
                        <div>{misc[`${prefix}Price`]}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RevealAnimation>
        <RevealAnimation delay={0.1} offset={5}>
          <p className="border-l-2 border-ns-green mt-[3rem] px-6 py-3 ml-1">
            *Twilight hours occur after 3pm, April 15th - Sept 15th and after 1pm Sept 16th - April 14th.
          </p>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default RatesSection;
