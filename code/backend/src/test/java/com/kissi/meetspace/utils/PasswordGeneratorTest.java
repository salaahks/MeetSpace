package com.kissi.meetspace.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

class PasswordGeneratorTest {

    @RepeatedTest(20)
    void generatedPasswordMeetsComplexityRules() {
        String password = PasswordGenerator.generate();

        assertEquals(16, password.length());
        assertTrue(password.chars().anyMatch(Character::isUpperCase));
        assertTrue(password.chars().anyMatch(Character::isLowerCase));
        assertTrue(password.chars().anyMatch(Character::isDigit));
        assertTrue(password.chars().anyMatch(c -> !Character.isLetterOrDigit(c)));
    }

    @Test
    void generatedPasswordsAreNotRepeated() {
        assertNotEquals(PasswordGenerator.generate(), PasswordGenerator.generate());
    }

    @Test
    void rejectsTooShortLength() {
        assertThrows(IllegalArgumentException.class, () -> PasswordGenerator.generate(3));
    }
}
