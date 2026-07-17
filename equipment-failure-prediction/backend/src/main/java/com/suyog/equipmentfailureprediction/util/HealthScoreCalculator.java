package com.suyog.equipmentfailureprediction.util;

public class HealthScoreCalculator {

    private HealthScoreCalculator() {}

    public static double calculate(double probability){

        return Math.round((100 - probability * 100) * 100.0) / 100.0;

    }

}