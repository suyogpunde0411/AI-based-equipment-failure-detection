package com.suyog.equipmentfailureprediction.util;

import com.suyog.equipmentfailureprediction.enums.RiskLevel;

public class RiskLevelCalculator {

    private RiskLevelCalculator(){}

    public static RiskLevel calculate(double probability){

        if(probability < 0.30)
            return RiskLevel.LOW;

        if(probability < 0.50)
            return RiskLevel.MEDIUM;

        if(probability < 0.75)
            return RiskLevel.HIGH;

        return RiskLevel.CRITICAL;

    }

}