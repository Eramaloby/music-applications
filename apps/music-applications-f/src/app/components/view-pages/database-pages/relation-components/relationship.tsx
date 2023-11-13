import { Tooltip } from "@mui/material";
import { RelationshipViewInterpretation } from "./utils";

export const RelationshipInterpretation = ({
  relationshipTitle,
  relationships,
  onClickCallback,
}: {
  relationshipTitle: string;
  relationships: RelationshipViewInterpretation[];
  onClickCallback: (type: string, id: string) => void;
}) => {
  return relationships.length !== 0 ? (
    <div className="relationship-container">
      <div className="relationship-title">{relationshipTitle}</div>
      <div className="relationships">
        {relationships.map((relInfo, index) => {
          return (
            <Tooltip title={relInfo.textForTooltip} placement="top" key={index}>
              <div
                key={relInfo.id}
                onClick={() =>
                  onClickCallback(relInfo.typeOfSourceOrTarget, relInfo.id)
                }
                className="relationship-link"
              >
                {relInfo.label}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};