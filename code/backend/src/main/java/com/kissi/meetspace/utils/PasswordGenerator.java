package com.kissi.meetspace.utils;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Generates temporary passwords that satisfy the Azure AD complexity policy
 * (upper case, lower case, digit and symbol). Users must change it at first sign-in.
 */
public final class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijkmnopqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SYMBOLS = "!@#$%&*?";
    private static final String ALL = UPPER + LOWER + DIGITS + SYMBOLS;
    private static final int DEFAULT_LENGTH = 16;
    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordGenerator() {
    }

    public static String generate() {
        return generate(DEFAULT_LENGTH);
    }

    public static String generate(int length) {
        if (length < 4) {
            throw new IllegalArgumentException("Password length must be at least 4");
        }
        List<Character> chars = new ArrayList<>(length);
        chars.add(randomChar(UPPER));
        chars.add(randomChar(LOWER));
        chars.add(randomChar(DIGITS));
        chars.add(randomChar(SYMBOLS));
        while (chars.size() < length) {
            chars.add(randomChar(ALL));
        }
        Collections.shuffle(chars, RANDOM);

        StringBuilder password = new StringBuilder(length);
        chars.forEach(password::append);
        return password.toString();
    }

    private static char randomChar(String alphabet) {
        return alphabet.charAt(RANDOM.nextInt(alphabet.length()));
    }
}
