import React, { useContext } from 'react';
import { C, S, ST_ABBR } from '../../constants';
import { ProjectContext as Ctx } from '../../context/ProjectContext';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Agent } from '../UI/Agent';

export default function JurisdictionIntel() {
    const { project } = useContext(Ctx);
    const loc = project.state ? (project.municipality ? `${project.municipality}, ${project.state}` : project.state) : "United States";

    const regSys = `You are a real estate development regulatory expert for ${loc}.`;
    const feeSys = `You are a development fee estimation expert for ${loc}.`;
    const compSys = `You are a compliance and environmental regulatory expert for ${loc}.`;
    const zoneSys = `You are a zoning and land use expert for ${loc}.`;

    return (
        <Tabs tabs={["Regulatory Intel", "Fee Estimator", "Compliance", "Zoning"]}>
            <div>
                <Card title={`Regulatory Intelligence — ${loc}`} action={project.state ? <Badge label={ST_ABBR[project.state] || ""} color={C.gold} /> : <Badge label="Set State" color={C.amber} />}>
                    <Agent id="RegulatoryIntel" system={regSys} placeholder={`Ask about regulations in ${loc}...`} />
                </Card>
            </div>
            <div>
                <Card title={`Fee Estimator — ${loc}`} action={project.state ? <Badge label={ST_ABBR[project.state] || ""} color={C.gold} /> : <Badge label="Set State" color={C.amber} />}>
                    <Agent id="FeeEstimator" system={feeSys} placeholder={`Ask about fees in ${loc}...`} />
                </Card>
            </div>
        </Tabs>
    );
}
